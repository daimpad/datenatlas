#!/usr/bin/env python3
"""Merge S-N agent outputs into sector JSON files."""
import json, os

SECTOR_FILES = {
    'staat': 'public/data/sector_staat.json',
    'wirtschaft': 'public/data/sector_wirtschaft.json',
    'wissenschaft': 'public/data/sector_wissenschaft.json',
    'zivilgesellschaft': 'public/data/sector_zivilgesellschaft.json',
    'medien': 'public/data/sector_medien.json',
    'religion': 'public/data/sector_religion.json',
    'bildung': 'public/data/sector_bildung.json',
}

AGENT_FILES = {
    'staat':            ['/tmp/sn_agent_1.json', '/tmp/sn_agent_2.json', '/tmp/sn_agent_3.json',
                         '/tmp/sn_agent_4.json', '/tmp/sn_agent_5.json'],
    'wirtschaft':       ['/tmp/sn_agent_6.json', '/tmp/sn_agent_7.json', '/tmp/sn_agent_8.json'],
    'wissenschaft':     ['/tmp/sn_agent_9.json', '/tmp/sn_agent_10.json'],
    'zivilgesellschaft':['/tmp/sn_agent_11.json', '/tmp/sn_agent_12.json', '/tmp/sn_agent_18.json'],
    'medien':           ['/tmp/sn_agent_13.json', '/tmp/sn_agent_14.json'],
    'religion':         ['/tmp/sn_agent_15.json'],
    'bildung':          ['/tmp/sn_agent_16.json', '/tmp/sn_agent_17.json'],
}

def find_l3(sector_data, l2_id, l3_id):
    for l2 in sector_data['children']:
        if l2['id'] == l2_id:
            for l3 in l2.get('children', []):
                if l3['id'] == l3_id:
                    return l3
    return None

def get_existing_ids(sector_data):
    ids = set()
    for l2 in sector_data['children']:
        for l3 in l2.get('children', []):
            for l4 in l3.get('children', []):
                ids.add(l4['id'])
    return ids

total_added = total_skipped = total_warn = 0

for sector, sector_file in SECTOR_FILES.items():
    with open(sector_file, encoding='utf-8') as f:
        data = json.load(f)
    existing_ids = get_existing_ids(data)
    added = skipped = warn = 0

    for agent_file in AGENT_FILES.get(sector, []):
        if not os.path.exists(agent_file):
            print(f'WARNING: {agent_file} missing!')
            continue
        try:
            with open(agent_file, encoding='utf-8') as f:
                entries = json.load(f)
        except Exception as e:
            print(f'ERROR reading {agent_file}: {e}')
            continue
        if isinstance(entries, dict):
            entries = [entries]

        for entry in entries:
            l2_id = entry.get('l2_id') or entry.get('l2')
            l3_id = entry.get('l3_id') or entry.get('l3')
            nodes = entry.get('nodes', [])

            l3_node = find_l3(data, l2_id, l3_id)
            if l3_node is None:
                print(f'  WARN L3 not found: {sector}/{l2_id}/{l3_id}')
                warn += 1
                continue

            for node in nodes:
                nid = node.get('id', '')
                if nid in existing_ids:
                    skipped += 1
                    continue
                required = ['id', 'level', 'name', 'color', 'details']
                if not all(k in node for k in required):
                    print(f'  WARN incomplete node {nid}')
                    warn += 1
                    continue
                if 'relevance' in node.get('details', {}):
                    node['details']['relevance'] = min(5, max(1, int(node['details']['relevance'])))
                l3_node.setdefault('children', []).append(node)
                existing_ids.add(nid)
                added += 1

    with open(sector_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{sector}: +{added} added, {skipped} skipped, {warn} warnings')
    total_added += added
    total_skipped += skipped
    total_warn += warn

print(f'\nTOTAL: +{total_added} added, {total_skipped} skipped, {total_warn} warnings')
