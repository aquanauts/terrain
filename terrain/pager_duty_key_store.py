import json

def obfuscate_keys(pager_duty_records):
    obfuscated_records = []
    for record in pager_duty_records:
        last_four_digits = record["key"][-4:]
        new_key = '*'*(len(record["key"])-4) + last_four_digits
        record["key"] = new_key
        obfuscated_records.append(record)
    return obfuscated_records

class PagerDutyKeyStore:

    def __init__(self, file_path=None):
        self.file_path = file_path
        self.file_path.touch(exist_ok=True)

    def _write_lines(self, lines):
        with self.file_path.open(mode="w") as key_log:
            key_log.write(json.dumps(lines))

    def add_key(self, new_key):
        lines = self.all_keys()
        for line in lines:
            if line["name"] == new_key["name"]:
                raise Exception('They key name entered is already taken. It must be unique.')
        lines.append(new_key)
        self._write_lines(lines)

    def all_keys(self):
        text = self.file_path.read_text()
        if text == '':
            return []
        return json.loads(text)

    def host_exists_and_key(self, host_name):
        all_key_dicts = self.all_keys()
        for key_dict in all_key_dicts:
            if (host_name in key_dict["host"]) or (key_dict["host"] in host_name):
                stored_key_for_host = key_dict["key"]
                return True, stored_key_for_host
        return False, ""

    def delete_key(self, key_name):
        lines = self.all_keys()
        self._write_lines([line for line in lines if line['name'] != key_name])
