# Panduan Ringkas Integrasi Halaman TanStack Start + Laravel

## Konteks Proyek Ini
- Frontend memakai TanStack Start, TanStack Query, Zod, Sonner, Axios, dan service layer di `src/services`.
- Route aktif ada di `src/routes/_auth/**` dan beberapa halaman masih memakai pola lokal/mock, jadi jangan bikin arsitektur baru kalau pola existing sudah ada.
- Backend memakai Laravel 12, Sanctum token-based auth, dan Spatie Permission.
- Axios frontend mengirim `Authorization: Bearer <token>` dan header `X-Koperasi-ID` dari `localStorage.koperasiActive`.

## Tujuan
Integrasikan halaman yang diberikan ke backend Laravel secara penuh, dengan mengikuti pattern yang sudah dipakai project ini.

## Yang Wajib Dibaca
1. Route TanStack Start untuk halaman itu.
2. Controller Laravel terkait.
3. Form Request, Resource, Model, policy/permission, enum/constant, dan relasi yang dipakai controller.
4. Service/API client dan route frontend lain yang mirip.
5. `routes/api.php` untuk memastikan endpoint memang ada.

## Pola Frontend Yang Harus Diikuti
- Tempatkan logika API di `src/services`.
- Gunakan `createFileRoute`, `validateSearch`, dan search params untuk page/filter/sort/search.
- Gunakan TanStack Query untuk fetch dan mutation.
- Sinkronkan URL dengan state UI.
- Tampilkan loading, empty, error, dan submit state.
- Ikuti pattern komponen yang sudah ada di `src/components`.
- Jangan pakai `any` kalau bisa dihindari.

## Permission Frontend
- Jangan baca `localStorage.permissions` langsung di setiap route.
- Pakai helper terpusat di `src/services/permissionService.ts`.
- Pattern yang dipakai adalah `getPermissionAccess(prefix)`.
- Hasilnya selalu:
	- `canView` untuk `prefix.lihat`, `prefix.modifikasi`, atau `prefix.admin`.
	- `canManage` untuk `prefix.modifikasi` atau `prefix.admin`.
	- `canDelete` hanya untuk `prefix.admin`.
- Gunakan prefix sesuai modul, misalnya `pengurus` atau `jabatan`.
- Kalau user tidak punya akses sama sekali untuk prefix tersebut, route boleh diarahkan ke `notFound()` atau tampilan akses ditolak sesuai pola halaman yang ada.
- Kalau permission ada tetapi action tertentu tidak, sembunyikan tombolnya, jangan tetap render lalu berharap backend menolak.

## Permission Yang Wajib Dicek Saat Integrasi
- `lihat`: halaman bisa dibuka, tabel/list boleh tampil, semua tombol aksi disembunyikan.
- `modifikasi`: halaman bisa dibuka, tombol tambah dan edit boleh tampil, tombol hapus disembunyikan.
- `admin`: halaman bisa dibuka, semua aksi termasuk delete boleh tampil.
- Terapkan aturan ini di route dan komponen tabel/dialog, bukan hanya di backend.
- Kalau modul punya dropdown atau action tambahan, cocokkan dengan level permission yang benar sebelum memanggil endpoint.

## Helper Permission
- File helper yang dipakai saat ini: `src/services/permissionService.ts`.
- Format pemakaian:
```ts
const { canView, canManage, canDelete } = getPermissionAccess('jabatan')
```
- Jangan duplikasi logic baca storage di route baru kalau prefix dan aturan levelnya sama.
- Jika perlu modul lain, cukup ganti prefix.

## Endpoint Laravel Yang Sudah Ada Di Proyek Ini
Gunakan endpoint yang benar-benar tersedia di `routes/api.php` yang nanti diberikan:

Kalau route frontend butuh data / backend minta data yang tidak ada inputnya / action yang belum tersedia di backend:
- tulis jelas `API NOT FOUND`
- tulis itu di documentation dengan file (route).md isinya adalah permintaan api terkait misalany penjelasan apa yang dibutuhkan, apa request dan apa yang diharapkan responsenya
- jangan mengarang endpoint
- jangan pakai fake data kecuali diminta

## Checklist Implementasi
- Baca alur bisnis halaman dari controller dan route frontend.
- Cocokkan request body, query params, response shape, pagination, dan permission.
- Implementasikan semua action yang memang ada: list, detail, create, update, delete, status toggle, dropdown, dan fetch relasi bila tersedia.
- Pastikan mutation meng-invalidate query yang tepat.
- Pastikan validasi frontend mengikuti FormRequest Laravel.
- Pastikan state submit tidak dobel dan error backend tampil jelas.

## Terapkan permssion yang diminta
- baca apa saja permission yang ada pada route
- setiap permission bisa apa saja. di permssion ada class dan level yang dipisahkan titik
- level lihat (tingkatan paling rendah bisa menakses halaman saja hanya melihat semua tombol disembunyikan)
- level modifikasi (tingkatan atasnya lihat dia bisa mengakses halaman, menambahkan dan mengedit data sembuyikan tombol delete atau yang sejenis (tentunya yang diminta di route itu))
- level admin (tingkatan puncak bisa segalanya termasuk hapus data)

## Checklist Verifikasi
Jalankan ini setelah perubahan:
```bash
cd Frontend
pnpm lint
pnpm exec eslint --ext .ts,.tsx src --fix
pnpm exec tsc --noEmit
```

Target akhir:
- tidak ada lint error
- tidak ada TypeScript error
- tidak ada unused import atau dead code dari perubahan
- semua endpoint yang ada sudah terhubung
- semua action UI yang memang tersedia benar-benar bekerja
- kalau endpoint belum ada, laporkan sebagai API NOT FOUND

## Format Laporan Akhir
Laporkan singkat:
1. Analisis singkat: endpoint yang dipakai, field penting, permission, dan endpoint yang hilang.
2. Implementasi: file yang diubah dan logic yang ditambahkan.
3. Validasi: hasil lint dan tsc.
