import json
import re


class ErrorStackFeatureStore:
    def __init__(self, file_path=None):
        self.file_path = file_path
        self.file_path.touch(exist_ok=True)

    def process(self, new_error_stack, id_number):
        # TODO TEST THIS
        # TODO have else condition where everything set to ignore or repeat?
        significant = False
        error_stack_features = extract_features_from_error_stack(new_error_stack)
        error_stack_features["id"] = id_number
        category = classify(new_error_stack, error_stack_features)
        error_stack_features["category"] = category
        self.write(json.dumps(error_stack_features))
        if category == "internal" or category == "new":
            significant = True
        return significant

    def write(self, content):
        with self.file_path.open(mode="a") as exceptions:
            exceptions.write(content + "\n")

    def read(self):
        return self.file_path.read_text()

    def read_entry(self, entry_id):
        all_entries = self.readlines()
        return json.loads(all_entries[entry_id])

    def readlines(self):
        lines = self.read().split("\n")
        if lines[-1] == "":
            return lines[0:-1]
        return lines

    def new_category_errors(self):
        new_error_stack_feature_list = []
        lines = self.readlines()
        for line in lines:
            line_dict = json.loads(line)
            if "category" in line_dict:
                if line_dict["category"] == "new":
                    new_error_stack_feature_list.append(line_dict)
        return new_error_stack_feature_list


def classify(error_stack, error_stack_features):
    if error_in_terrain(error_stack) is True:
        if error_is_terrain_example(error_stack_features["error_message"]) is True:
            return "ignore"
        return "internal"
    # if is_new(error_stack_features) is True:
    #     return "new"
    return "repeat"


def error_in_terrain(error_stack: str) -> bool:
    # TODO fix this to actual terrain
    if "cy2-desktop-21" in error_stack:
        return True
    if "terrain.aq.tc" in error_stack:
        return True
    return False


def error_is_terrain_example(error_message: str) -> bool:
    if "Example created" in error_message:
        return True
    return False


def file_has_minified_content(file_name: str, character_number: int, line_length_threshold=1000) -> bool:
    if "min.js" in file_name or "min.css" in file_name:
        return True
    if character_number > line_length_threshold:
        return True
    return False


def extract_features_from_error_stack(error_stack: str) -> dict:
    lines = error_stack.split("\n    ")
    print(lines)
    first_line = lines[0].split(": ")
    # print(first_line)
    error_type = first_line[0]
    error_message = first_line[1]
    print("type:", error_type)
    print("message:", error_message)
    locations = []
    if len(lines) > 1:
        for line in lines[1:]:
            # print("line:", line)
            code_part = line[3:].split(" (")[0]
            # print("code part:", code_part)
            code_file_location_with_nums = line[3:].split(" (")[1]
            # print("code file location with extra stuff:", code_file_location_with_nums)
            code_file_location_regex = re.compile(r'(\S+):(\d+):(\d+)\)')
            matched_groups = code_file_location_regex.match(code_file_location_with_nums)
            code_file_location = matched_groups.group(1)
            line_num = line.split(":")[-2]
            char_num = line.split(":")[-1][:-1]
            locations.append({"problem_element": code_part,
                              "problem_element_location": code_file_location,
                              "line_number_in_code": line_num,
                              "character_number_in_line": char_num})
    return {"error_type": error_type,
            "error_message": error_message,
            "trace_problem_locations": locations}


def is_new(feature_dict):
    if feature_dict["id"] == 0:
        return True
    # look at previous "new" error number/name
    # have case for 0 (never checked for new before)
    # compare features to previous "new" errors
    # remove any redundant ones
    # for line in self.readlines:
    #    line_dict = json.loads(line)
    #    if line_dict["category"] == "ignore" or line_dict["category"] == "repeat":
    #        return False
    #    is_similar = two_feature_sets_are_repeats(line_dict)

    return False


def two_feature_sets_are_repeats():
    return False

# test_string = "TypeError: reversedArray[rowNum].appendTo is not a function\n    \
# at reverseOrder2 (http://cy2-desktop-21:8000/js/views/helpers/sort.js:43:31)\n    \
# at HTMLTableCellElement.onclick (http://cy2-desktop-21:8000/#sessionID-472:1:1)"
#
# test_string_2 = "SyntaxError: Unexpected token *\n"
#
# res = extract_features_from_error_stack(test_string)
# res2 = extract_features_from_error_stack(test_string_2)
# print(res)
# print(res2)
