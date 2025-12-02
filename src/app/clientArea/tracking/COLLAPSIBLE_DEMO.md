# 📦 Fitur Collapsible Timeline - Demo & Dokumentasi

## 🎯 Overview
Timeline tracking sekarang bisa **ditutup dan dibuka** untuk menghemat ruang layar dan memberikan pengalaman yang lebih bersih.

---

## 🎨 Visual Demo

### **STATE 1: Timeline Tertutup (Default)**
```
┌────────────────────────────────────────────────────────────┐
│  🕐  Riwayat Pengiriman                             ▼      │
│      Timeline perjalanan paket (11 checkpoint)             │
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║  ℹ️  Klik untuk melihat detail riwayat pengiriman    ║ │
│  ║      lengkap                                          ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
└────────────────────────────────────────────────────────────┘
```

### **STATE 2: Timeline Terbuka (Expanded)**
```
┌────────────────────────────────────────────────────────────┐
│  🕐  Riwayat Pengiriman                             ▲      │
│      Timeline perjalanan paket (11 checkpoint)             │
│                                                             │
│  ●━━━ Diterima oleh FIKRI EL SARA (Penerima Langsung)     │
│  │    📅 11 Oktober 2024  ⏰ 09:26                        │
│  │                                                          │
│  ○━━━ Proses pengantaran oleh kurir WAHANA Bogor          │
│  │    📅 11 Oktober 2024  ⏰ 08:20                        │
│  │                                                          │
│  ○━━━ Diterima di fasilitas WAHANA Bogor                   │
│  │    📅 11 Oktober 2024  ⏰ 06:58                        │
│  │                                                          │
│  ○━━━ Proses pengiriman ke alamat tujuan                   │
│  │    📅 10 Oktober 2024  ⏰ 09:30                        │
│  │                                                          │
│  ○━━━ Diterima di fasilitas WAHANA HUB Jakarta 3          │
│  │    📅 10 Oktober 2024  ⏰ 08:31                        │
│  │                                                          │
│  ⋮                                                          │
│  │                                                          │
│  ○━━━ Diterima di Sales Counter AGEN WPL BANTUL            │
│       📅 08 Oktober 2024  ⏰ 11:14                         │
└────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### State Management
```typescript
const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
```

### Toggle Button
```typescript
<button
  onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
  className="w-full flex items-center justify-between hover:bg-gray-50 rounded-xl p-4 transition-colors"
>
  <div className="flex items-center gap-3">
    <Clock icon />
    <div>
      <h3>Riwayat Pengiriman</h3>
      <p>Timeline perjalanan paket ({manifest.length} checkpoint)</p>
    </div>
  </div>
  {isTimelineExpanded ? <ChevronUp /> : <ChevronDown />}
</button>
```

### Conditional Rendering
```typescript
{!isTimelineExpanded && (
  <div className="info-box">
    Klik untuk melihat detail riwayat pengiriman lengkap
  </div>
)}

{isTimelineExpanded && (
  <div className="timeline">
    {/* Full timeline content */}
  </div>
)}
```

---

## 🎯 User Experience Benefits

### ✅ Keuntungan:
1. **Hemat Ruang Layar** - Timeline panjang tidak langsung memenuhi layar
2. **Loading Lebih Cepat** - Render conditional mengurangi DOM elements
3. **Fokus yang Lebih Baik** - User melihat info penting terlebih dahulu
4. **Mobile-Friendly** - Lebih nyaman untuk layar kecil
5. **Progressive Disclosure** - User memilih kapan ingin melihat detail

### 📊 Hierarchy Informasi:
```
Priority 1: Status Pengiriman (Always Visible)
  ├─ Delivered/In Transit Badge
  ├─ Nomor Resi & Kurir
  └─ Info Pengirim & Penerima

Priority 2: Riwayat Lengkap (Collapsible)
  └─ Timeline dengan semua checkpoint
```

---

## 🎨 Design Details

### Default State (Closed)
- **Background**: White card dengan shadow
- **Icon**: Clock (Purple)
- **Chevron**: Down arrow (Gray)
- **Hint Box**: Blue info box dengan teks petunjuk

### Expanded State (Open)
- **Chevron**: Up arrow (Gray)
- **Timeline**: Vertical line dengan gradient
- **First Item**: Highlighted dengan background biru
- **Other Items**: Standard dengan circle dots
- **Last Item**: Gray gradient dot

### Visual Indicators
| Element | Closed | Open |
|---------|--------|------|
| Chevron Direction | ▼ Down | ▲ Up |
| Content Height | ~120px | ~600-800px |
| Hint Box | Visible | Hidden |
| Timeline | Hidden | Visible |

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Timeline tertutup by default
- Satu kolom penuh
- Touch-friendly button size (min 44x44px)

### Tablet (768px - 1024px)
- Timeline tertutup by default
- Spacing disesuaikan

### Desktop (> 1024px)
- Timeline tertutup by default
- Max width 4xl (896px)
- Hover effects aktif

---

## 🔄 User Flow

```
User masuk halaman tracking
         ↓
Lihat status utama (Delivered/In Transit)
         ↓
Lihat info card (Resi, Pengirim, Penerima)
         ↓
[OPTIONAL] Klik "Riwayat Pengiriman"
         ↓
Timeline expand → Lihat semua checkpoint
         ↓
[OPTIONAL] Klik lagi untuk tutup
         ↓
Timeline collapse → Kembali ke view ringkas
```

---

## 🎬 Animation & Transitions

```css
/* Button Hover */
.toggle-button {
  transition: background-color 200ms ease;
}
.toggle-button:hover {
  background-color: #f9fafb; /* gray-50 */
}

/* Content Transition (handled by React conditional render) */
- Instant show/hide (no slide animation for better performance)
- Browser handles DOM mount/unmount smoothly
```

---

## 📝 Code Example

### Full Implementation:
```tsx
// State
const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

// Toggle Button
<button onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}>
  <Clock /> Riwayat Pengiriman
  {isTimelineExpanded ? <ChevronUp /> : <ChevronDown />}
</button>

// Hint when closed
{!isTimelineExpanded && (
  <div className="hint-box">
    Klik untuk melihat detail riwayat pengiriman lengkap
  </div>
)}

// Full timeline when expanded
{isTimelineExpanded && (
  <div className="timeline">
    {manifest.map((item, index) => (
      <TimelineItem key={index} {...item} />
    ))}
  </div>
)}
```

---

## 🚀 Future Enhancements

### Potential Improvements:
1. **Remember State** - LocalStorage untuk ingat preferensi user
2. **Smooth Animation** - CSS transition untuk expand/collapse
3. **Auto Expand** - Jika checkpoint < 3, langsung terbuka
4. **Quick Preview** - Hover untuk preview 2-3 item teratas
5. **Lazy Loading** - Load timeline content only when expanded

### Example: LocalStorage Integration
```typescript
const [isTimelineExpanded, setIsTimelineExpanded] = useState(() => {
  const saved = localStorage.getItem('timeline-expanded');
  return saved ? JSON.parse(saved) : false;
});

useEffect(() => {
  localStorage.setItem('timeline-expanded', JSON.stringify(isTimelineExpanded));
}, [isTimelineExpanded]);
```

---

## 🎯 Testing Checklist

- [ ] Click button toggles state correctly
- [ ] Chevron icon changes direction
- [ ] Timeline shows/hides properly
- [ ] Hint box appears only when closed
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Touch devices work smoothly
- [ ] No layout shift when toggling
- [ ] Smooth user experience

---

## 📞 Button Location (Orders Page)

### Lokasi Button "Lacak" di Halaman Orders:

```
┌─────────────────────────────────────────────────────┐
│  📋 INV-2024-001                    [Sudah Dibayar] │
│  27 November 2024 pukul 10:00                       │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📍 Nomor Resi                    [🚚 Lacak] │   │ ← Button Lacak
│  │    MT685U91                                  │   │
│  │    Wahana                                    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  🖼️ Produk A                                        │
│     2 x Rp 100.000                                  │
│                                                      │
│  Total Belanja: Rp 250.000                          │
└─────────────────────────────────────────────────────┘
```

### Button Behavior:
- **Kondisi Muncul**: Hanya jika `order.resi_pengiriman` ada dan tidak null
- **Tab**: Muncul di tab "Diproses" (processing)
- **Action**: `router.push('/clientArea/tracking/' + resi)`
- **Style**: Blue button dengan Truck icon
- **Responsive**: Full width di mobile, auto di desktop

---

## 🎉 Summary

Fitur collapsible timeline memberikan:
- ✅ Better UX dengan progressive disclosure
- ✅ Cleaner interface
- ✅ Mobile-friendly
- ✅ Performance optimization
- ✅ User control atas informasi yang ditampilkan

**Default state**: Tertutup (collapsed)
**User action**: Klik untuk expand/collapse
**Result**: Timeline bisa dibuka tutup sesuai kebutuhan

---

**Last Updated**: 2024
**Version**: 1.0