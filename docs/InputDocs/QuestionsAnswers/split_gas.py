import os
import sys
import re

# Usage: python split_qas.py input1.md input2.md ...
def extract_qas_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match from 'id: Qxxx' to the next 'id: Qxxx' or EOF
    pattern = re.compile(r'(id: Q\d{3}.*?)\n(?=id: Q\d{3}|\Z)', re.DOTALL)
    matches = pattern.findall(content)

    return matches

def save_qas_to_files(qas):
    output_dir = 'split_qas'
    os.makedirs(output_dir, exist_ok=True)

    for qa in qas:
        match = re.search(r'id: (Q\d{3})', qa)
        if match:
            qa_id = match.group(1)
            file_path = os.path.join(output_dir, f'{qa_id}.md')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(qa)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python split_qas.py <file1.md> [<file2.md> ...]")
        sys.exit(1)

    all_qas = []
    for file_path in sys.argv[1:]:
        qas = extract_qas_from_file(file_path)
        all_qas.extend(qas)

    save_qas_to_files(all_qas)
    print(f"✅ Extracted and saved {len(all_qas)} QAs to 'split_qas/' folder.")
