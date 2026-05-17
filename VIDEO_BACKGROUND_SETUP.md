# Video Background Setup ✅

**Video File:** HORILAL TRAILER.mp4
**Location:** `/frontend/public/`
**Applied to:** Hero Section Background

---

## ✅ **What Was Implemented**

### **1. Local Video Integration**
- ✅ Changed from external URL to local video file
- ✅ Video path: `/HORILAL TRAILER.mp4` (served from public folder)
- ✅ Vite automatically serves files from public folder

### **2. Video Settings**
```typescript
<video
  ref={videoRef}
  autoPlay        // ✅ Starts automatically
  loop            // ✅ Loops continuously
  muted           // ✅ Muted by default
  playsInline     // ✅ Plays inline on mobile
  playbackRate={0.8}  // ✅ Slightly slowed down (80% speed)
>
  <source src="/HORILAL TRAILER.mp4" type="video/mp4" />
</video>
```

### **3. Visual Effects Applied**

#### **Layer 1: Video**
- Full screen video covering entire background
- Object-fit: cover (maintains aspect ratio)

#### **Layer 2: Dark Overlay** (60% black)
```css
bg-black/60
```
Makes the video darker for better text readability

#### **Layer 3: Vignette Effect**
```css
radial-gradient(
  circle at center,
  transparent 0%,           /* Clear center */
  transparent 40%,          /* Clear middle */
  rgba(0,0,0,0.4) 70%,     /* Darkens toward edges */
  rgba(0,0,0,0.8) 100%     /* Very dark at edges */
)
```
Creates a cinematic focus effect - bright center, dark edges

#### **Layer 4: Gradient Overlay**
```css
bg-gradient-to-b from-background/30 via-background/50 to-background
```
- Top: 30% opacity
- Middle: 50% opacity
- Bottom: Solid background color
- Ensures smooth transition to content below

---

## 🎨 **Visual Effect Breakdown**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Layer 4: Gradient Overlay (Top to Bottom)         │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  │  Layer 3: Vignette Effect (Center to Edges)  │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │                                         │ │ │
│  │  │  Layer 2: Dark Overlay (60% black)     │ │ │
│  │  │  ┌───────────────────────────────────┐ │ │ │
│  │  │  │                                   │ │ │ │
│  │  │  │  Layer 1: Video (HORILAL TRAILER)│ │ │ │
│  │  │  │  • Autoplay                       │ │ │ │
│  │  │  │  • Muted                          │ │ │ │
│  │  │  │  • Loop                           │ │ │ │
│  │  │  │  • 80% playback speed            │ │ │ │
│  │  │  │                                   │ │ │ │
│  │  │  └───────────────────────────────────┘ │ │ │
│  │  │                                         │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 **File Structure**

```
carkumbh/
├── frontend/
│   ├── public/
│   │   └── HORILAL TRAILER.mp4          ← Your video file
│   │
│   └── src/
│       ├── components/
│       │   └── VideoBackground.tsx      ← Updated component
│       │
│       └── pages/
│           └── Index.tsx                ← Uses VideoBackground
```

---

## 🎬 **Video Background Component**

```typescript
import { useEffect, useRef } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;  // Slow motion effect
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/HORILAL TRAILER.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay - 60% black */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Vignette effect - darker edges */}
      <div className="absolute inset-0 z-20"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Gradient overlay - top to bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-30" />
    </div>
  );
};
```

---

## 🎯 **Z-Index Layering**

From bottom to top:

1. **z-0** - Video background container (fixed position)
2. **z-10** - Dark overlay (60% black)
3. **z-20** - Vignette effect (radial gradient)
4. **z-30** - Gradient overlay (top to bottom)
5. **z-20** - Page content (hero section, booking form, etc.)

---

## 📱 **Mobile Optimization**

- ✅ **playsInline** attribute prevents fullscreen on iOS
- ✅ **object-cover** maintains aspect ratio on all screens
- ✅ **Muted** by default (required for autoplay on mobile)
- ✅ **Fixed positioning** keeps video in place during scroll

---

## 🎨 **Effect Customization**

### **Adjust Dark Overlay Intensity**
```tsx
// Lighter: bg-black/40 (40% black)
<div className="absolute inset-0 bg-black/40 z-10" />

// Current: bg-black/60 (60% black)
<div className="absolute inset-0 bg-black/60 z-10" />

// Darker: bg-black/80 (80% black)
<div className="absolute inset-0 bg-black/80 z-10" />
```

### **Adjust Vignette Effect**
```css
/* Subtle vignette */
background: 'radial-gradient(circle, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.6) 100%)'

/* Current (medium) */
background: 'radial-gradient(circle, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)'

/* Strong vignette */
background: 'radial-gradient(circle, transparent 0%, transparent 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)'
```

### **Adjust Video Playback Speed**
```typescript
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 1.0;   // Normal speed
    // videoRef.current.playbackRate = 0.5; // Half speed (slow motion)
    // videoRef.current.playbackRate = 0.8; // Current (slightly slow)
    // videoRef.current.playbackRate = 1.5; // 1.5x speed
  }
}, []);
```

---

## ✅ **Testing**

### **View the Video Background:**
1. Open http://localhost:8080
2. You should see:
   - ✅ HORILAL TRAILER video playing in background
   - ✅ Video is muted and autoplays
   - ✅ Video loops continuously
   - ✅ Dark overlay makes text readable
   - ✅ Vignette effect focuses attention on center
   - ✅ Smooth gradient from video to content below

### **Check Console for Errors:**
```javascript
// Open DevTools Console
// No errors should appear
// Video should load from: http://localhost:8080/HORILAL%20TRAILER.mp4
```

### **Mobile Testing:**
- Video should play inline (not fullscreen)
- Autoplay works (because it's muted)
- Video fills entire screen on all devices

---

## 🔧 **Troubleshooting**

### **Video doesn't play:**
1. Check file exists: `/Users/erpratik/Desktop/carkumbh/frontend/public/HORILAL TRAILER.mp4`
2. Check browser console for errors
3. Try hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### **Video is too dark:**
Reduce the dark overlay opacity in VideoBackground.tsx:
```tsx
<div className="absolute inset-0 bg-black/40 z-10" />  // 40% instead of 60%
```

### **Video is too bright:**
Increase the dark overlay opacity:
```tsx
<div className="absolute inset-0 bg-black/80 z-10" />  // 80% instead of 60%
```

### **Vignette is too strong:**
Adjust the gradient values in VideoBackground.tsx:
```tsx
background: 'radial-gradient(circle, transparent 0%, transparent 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.5) 100%)'
```

---

## 🎬 **Current Setup**

- ✅ **Video:** HORILAL TRAILER.mp4
- ✅ **Autoplay:** Yes (muted)
- ✅ **Loop:** Yes
- ✅ **Playback Speed:** 80%
- ✅ **Dark Overlay:** 60% black
- ✅ **Vignette:** Radial gradient (clear center → dark edges)
- ✅ **Top Gradient:** 30% → 50% → solid
- ✅ **Mobile Support:** playsInline enabled

---

## 🎉 **Result**

Your hero section now features:
- ✅ Cinematic HORILAL TRAILER video background
- ✅ Professional vignette effect
- ✅ Dark overlay for readability
- ✅ Smooth gradient to content
- ✅ Auto-playing and looping
- ✅ Muted by default
- ✅ Mobile-optimized

**View it live at:** http://localhost:8080 🚀
