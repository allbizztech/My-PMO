with open(r'd:\xampp\htdocs\My-PMO\client\src\App.jsx', 'r', encoding='utf-8') as f:
    t = f.read()

old_str = 'className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl object-contain shadow-xs shrink-0"'
new_str = 'className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl object-contain shrink-0 drop-shadow-sm transition-transform hover:scale-105"'

if old_str in t:
    t = t.replace(old_str, new_str)
    with open(r'd:\xampp\htdocs\My-PMO\client\src\App.jsx', 'w', encoding='utf-8') as f:
        f.write(t)
    print("App.jsx logo updated!")
else:
    print("Target string not found in App.jsx")
