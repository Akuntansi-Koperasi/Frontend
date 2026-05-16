

## Instruksi singkat (untuk AI)

Tujuan: jalankan perubahan UI/pagination seragam di kode Frontend lalu laporkan hasilnya dalam format JSON.

Input: project root `Frontend`.

Langkah (eksekusi otomatis):
1. Temukan semua route yang pakai pagination di `src/routes/_auth/**`.
2. Untuk tiap route: set schema `per_page` default ke `10` (z.catch(10) atau .catch(10)).
3. Ganti logika paging menjadi:
	- `pageIndex = page - 1`
	- slice: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`
4. Dialog yang berhubungan dengan tabel ditempatkan di dalam komponen tabel.

Verifikasi (perintah yang harus dijalankan setelah perubahan):
```bash
cd Frontend
pnpm exec eslint --ext .ts,.tsx src --fix
pnpm exec tsc --noEmit
```

Output (laporan — format manusia, isi detail):

Changed files:
- path/changed/file1
- path/changed/file2

Edits (ringkasan per file):
- path/changed/file1: Ubah pagination default ke 10; ganti safePageIndex dengan pageIndex
- path/changed/file2: Ganti checkbox menjadi Switch; pakai Badge untuk kolom multiple

Lint errors:
- before: N
- after: M

Commands yang dijalankan:
- pnpm exec eslint --ext .ts,.tsx src --fix
- pnpm exec tsc --noEmit

Notes:
- Catatan tambahan dan hal yang perlu dilanjutkan.

Kriteria keberhasilan:
- Semua route pagination default `per_page` = 10
- Dialog/table menggunakan `Badge`/`Switch`/`Select`/lainnnya sesuai spesifikasi yang diminta
- `eslint --fix` mengurangi error; `tsc --noEmit` tidak menampilkan error baru pada file yang diubah

Catatan: fokuskan perbaikan lint pada file yang diubah terlebih dahulu.

---

Gunakan format laporan manusia di atas untuk laporan akhir; sertakan semua field yang disebut (changed files, edits, lintErrors, commands, notes).

