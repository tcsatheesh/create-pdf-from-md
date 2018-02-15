# create-pdf-from-md

This project is to create a pdf file from a markdown file. 

## Pre-requisites

1. nodejs latest version

## Steps

1. Download and install the latest version of nodejs.
2. Navigate to the folder containing the create.js file.
3. Create or update the package.json file using your favourite editor. The contents are as below.

    ```json
    {
      "name": "docs",
      "version": "1.0.0",
      "description": "Create pdf from md file.",
      "main": "",
      "scripts": {
        "create-html": "node .\\create.js <input path relative to create.js script> ./output github"
      },
      "author": "Author",
      "license": "License",
      "dependencies": {
        "markdown-styles": "^3.1.10",
        "phantom": "^4.0.12"
      }
    }
      ```

4. Edit the input folder name and output folder name as desired in the create-html section. Input folder is the one containing the markdown files and the output folder is the one containing the html output files.
5. In a command prompt navigate to the folder containing the create.js file and run the following command. This installs the dependencies identified in the package.json.

    ```powershell
    npm intall
    ```

6. Next run the following command

    ```cmd
    npm run-script create-pdf
    ```

7. Check the output folder contains the html files.
8. Copy any assets like images, css etc to the output folder. Use the same folder structure when creating the markdown.
9. Open the html in a browser and use print to pdf to generate the pdf. _Note: This needs revising to automate the process._

## Known Issues

1. In Windows ensure that the "Size of text, apps and other items" in the Display properties is set to 100% before running this script. A fix is being explored.
2. If your markdown uses other assets then copy these manually to the output folder and run the script.
