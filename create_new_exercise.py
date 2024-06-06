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

    # make new exercise files)
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

        # edit new files to have correct links
        try:
            for file in os.scandir(path):
                with open(file.path, "r+") as file:
                    content = file.read()
                    # delete old content
                    file.truncate(0)
                    file.seek(0)
                    content = content.replace(template_string, filename)
                    file.write(content)
        except Exception as e:
            print("couldn't edit new files ", e)
            sys.exit(4)

    # update exercise list
    try:
        # make backup
        with open("./src/exercises_list.json", "r") as file:
            open("./src/exercises_list_backup.json", "w").write(file.read())

        # make a new json file
        with open("./src/exercises_list.json", "r") as file:
            # parse json
            parsed_json = json.load(file)
            json_list = parsed_json["list"]

            # use folders in src as an exercise list
            folder_list = [entry.name for entry in os.scandir("./src/") if entry.is_dir()]
            try:
                folder_list.remove(template_string)
            except:
                pass
            parsed_json["list"] = folder_list

            # write new json file
            open("./src/exercises_list.json", "w").write(json.dumps(parsed_json))
    except Exception as e:
        print("error with .json file ", e)
        sys.exit(5)

# if file has not been found:
else:
    sys.exit(1)
