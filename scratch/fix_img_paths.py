import os

files = [
    r'client/src/App.jsx',
    r'client/src/pages/LandingPage.jsx',
    r'client/src/pages/LoginPage.jsx',
    r'client/src/pages/ReportsPage.jsx'
]

for fp in files:
    full_path = os.path.join(r'd:\xampp\htdocs\My-PMO', fp)
    with open(full_path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    t = t.replace('src="/logo.png"', 'src="/My-PMO/logo.png"')
    t = t.replace('src="/istana-kehakiman.png"', 'src="/My-PMO/istana-kehakiman.png"')
    t = t.replace('src="/favicon.png"', 'src="/My-PMO/favicon.png"')
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(t)
    print("Updated:", full_path)
