import os 
import sys
import pathlib
import shutil
import json

template_string = "exercise template"

def paths(filename: str = template_string):
    """get new paths with given filename, initializes itself with template"""
    return {
        "src_path": f"./src/{filename}",
        "Public_path": f"./Public/{filename}",
    }

# store for exercises, has list of exercises, needs updating
exercise_store = "./src/exerciseStore.jsx"

template_paths = paths()

# check if template files exist
paths_found = True
for path in template_paths.values():
    if pathlib.Path(path).is_dir():
        continue
    # no template file found
    print(f"Template directory {path} not found")
    paths_found = False

# check if store where exercises are listed exists
if not pathlib.Path(exercise_store).is_file():
    print("no exerciseStore.jsx found")
    paths_found = False

# if files found:
if paths_found:
    print("Template files exist")

    filename = input("Please enter new exercise name: ")

    # make new exercise files
    for path_name, path in paths(filename).items():
        # copy from template to new folder
        try: 
            shutil.copytree(template_paths[path_name], path)
            pass
        except Exception as e:
            print("couldn't create new files ", e)
            sys.exit(2)

        # rename files
        try:
            for file in os.scandir(path):
                directory, template_name, extension = file.path.partition(template_string)
                os.rename(file.path, f"{directory}{filename}{extension}")
        except Exception as e:
            print("coulnd't rename new files ", e)
            sys.exit(3)

    # update exercise list
    try:
        with open("./src/exercises_list.json", "r") as file:
            # make backup
            open("exercises_list_backup.json", "w").write(file.)
            file_json = json.load(file)
            file_json["list"].append(filename)
            print(file_json)
            new_list = list(set(file_json["list"]))
            file_json["list"] = new_list
            open("test.json", "w").write(json.dumps(file_json))
    except Exception as e:
        print("error with .json file ", e)
        sys.exit(4)

# if file has not been found:
else:
    sys.exit(1)
