# ⚙️ How to Configure HYNO (Super Simple!)

## 🎯 Configuration File

**File:** `/public/config.js`

This is the **ONLY** file you need to edit for configuration!

---

## 📝 Current Configuration

```javascript
window.__ENV__ = {
  // Backend Mode: 'false' = mock data, 'true' = real backend
  REACT_APP_USE_BACKEND: 'false',
  
  // Backend URL (only used when USE_BACKEND is true)
  REACT_APP_API_URL: 'http://localhost:8080/api'
};
```

---

## 🔄 How to Switch Modes

### Mock Data Mode (Current - Default)
```javascript
REACT_APP_USE_BACKEND: 'false',
```

✅ Works immediately  
✅ No backend needed  
✅ Perfect for testing  

### Backend Mode (When Spring Boot is ready)
```javascript
REACT_APP_USE_BACKEND: 'true',
```

✅ Uses real database  
✅ Data persists  
✅ Production ready  

---

## 🚀 Quick Steps

### To Use Mock Data (Now):
1. File already set to `'false'`
2. Run `npm start`
3. Done! ✅

### To Use Backend (Later):
1. Open `/public/config.js`
2. Change `'false'` to `'true'`
3. Save file
4. Reload browser
5. Done! ✅

**No rebuild needed!** Just reload the page.

---

## 🎨 Visual Guide

```
Current (Mock):                  Future (Backend):
┌─────────────────┐             ┌─────────────────┐
│ config.js       │             │ config.js       │
├─────────────────┤             ├─────────────────┤
│ USE_BACKEND:    │             │ USE_BACKEND:    │
│   'false' ←✅   │   →  Edit   │   'true'  ←✅   │
└─────────────────┘             └─────────────────┘
        ↓                               ↓
   [Mock Data]                   [Real Backend]
```

---

## 🔍 How to Verify

After changing the config, look at **bottom-right** of the app:

### Mock Mode Shows:
```
╔════════════════════╗
║  System Status     ║
╠════════════════════╣
║ 📡 Frontend  ✅    ║
║ 🖥️  Backend   📋   ║
║ ℹ️  Mock data mode ║
╚════════════════════╝
```

### Backend Mode Shows:
```
╔════════════════════╗
║  System Status     ║
╠════════════════════╣
║ 📡 Frontend  ✅    ║
║ 🖥️  Backend   ✅    ║
║ 💾 Database  ✅    ║
╚════════════════════╝
```

---

## 🎓 Examples

### Example 1: Development (Mock)
```javascript
// /public/config.js
window.__ENV__ = {
  REACT_APP_USE_BACKEND: 'false',
  REACT_APP_API_URL: 'http://localhost:8080/api'
};
```
Use this for testing and development.

### Example 2: Production (Backend)
```javascript
// /public/config.js
window.__ENV__ = {
  REACT_APP_USE_BACKEND: 'true',
  REACT_APP_API_URL: 'https://api.yourserver.com/api'
};
```
Use this when deploying with real backend.

### Example 3: Custom Backend Port
```javascript
// /public/config.js
window.__ENV__ = {
  REACT_APP_USE_BACKEND: 'true',
  REACT_APP_API_URL: 'http://localhost:9090/api'  // Custom port
};
```

---

## ⚠️ Important Notes

1. **No Rebuild Needed** - Just reload browser after changes
2. **One File Only** - Only edit `/public/config.js`
3. **String Values** - Use `'true'` or `'false'` (with quotes)
4. **Reload Page** - Changes apply after browser reload

---

## 🐛 Troubleshooting

### Problem: Changes not applied
**Solution:** Hard reload browser (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: Backend shows offline
**Solution 1:** Check if Spring Boot is running  
**Solution 2:** Verify API_URL is correct  
**Solution 3:** App will use mock data as fallback

### Problem: Want to go back to mock mode
**Solution:** Change `'true'` to `'false'` and reload

---

## 📚 Related Files

- Configuration: `/public/config.js` ← **EDIT THIS**
- Config Manager: `/lib/config.ts` ← Don't edit
- API Client: `/lib/api-client.ts` ← Don't edit
- Store: `/lib/app-store.tsx` ← Don't edit

**Only edit `/public/config.js`!**

---

## 🎉 Summary

| Task | File | Action | Restart? |
|------|------|--------|----------|
| Use mock data | `/public/config.js` | Set to `'false'` | Reload browser |
| Use backend | `/public/config.js` | Set to `'true'` | Reload browser |
| Change API URL | `/public/config.js` | Edit URL | Reload browser |

**That's it! Super simple!** 🚀

---

## 💡 Pro Tips

1. **Keep backup** - Save a copy of config.js before changes
2. **Test first** - Use mock mode to test features
3. **Switch easily** - Can switch back anytime
4. **No errors** - App handles both modes automatically

---

**Configuration is now as simple as changing ONE line and reloading!** ✨
