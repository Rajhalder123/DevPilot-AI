import os
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace blue primary color
    content = content.replace('#3B82F6', 'var(--primary)')
    content = content.replace('#3b82f6', 'var(--primary)')
    
    # Replace blue rgba variants (common ones)
    content = content.replace('rgba(59,130,246', 'rgba(249,115,22')
    content = content.replace('rgba(59, 130, 246', 'rgba(249, 115, 22')
    content = content.replace('rgba(59 130 246', 'rgba(249 115 22')
    
    # Replace teal/cyan accent with accent var
    content = content.replace('#06B6D4', 'var(--accent)')
    content = content.replace('#0EA5E9', 'var(--accent)')
    
    # Replace the 'var(--accent)' based rgba for teal
    content = content.replace('rgba(6,182,212', 'rgba(245,158,11')
    content = content.replace('rgba(6, 182, 212', 'rgba(245, 158, 11')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")
    else:
        print(f"No changes: {filepath}")

# Fix all tsx files in dashboard
base = r'c:\Users\ADMIN\OneDrive\Desktop\warning!\DevPilot-AI\frontend\src\app'
for filepath in glob.glob(os.path.join(base, '**', '*.tsx'), recursive=True):
    fix_file(filepath)

# Also fix components
components_base = r'c:\Users\ADMIN\OneDrive\Desktop\warning!\DevPilot-AI\frontend\src\components'
for filepath in glob.glob(os.path.join(components_base, '**', '*.tsx'), recursive=True):
    fix_file(filepath)

print("Done!")
