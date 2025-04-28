# Academic Calculators

This project provides a set of academic calculators to help students calculate their GPA, minimum required grades, and Erasmus eligibility scores. The calculators are built using HTML, CSS, and JavaScript, and they utilize Bootstrap for styling and modals. This project was made by a group.

## Project Structure

- `index.html`: The main HTML file that contains the structure of the web page and modals for each calculator.
- `script.js`: The JavaScript file that contains the logic for the GPA Calculator, Minimum Grade Calculator, and Erasmus Score Calculator.
- `styles.css`: The CSS file that contains custom styles for the project.

## Features

### GPA Calculator

- Calculate Semester GPA
- Calculate Overall GPA
- Supports multiple grading systems

### Minimum Grade Calculator

- Calculate the minimum required grade to achieve a target letter grade
- Supports multiple grading systems
- Allows adding multiple components with different weights

### Erasmus Score Calculator

- Calculate Erasmus eligibility score based on GPA and language score
- Allows setting custom weights for GPA and language score

## Usage

1. Clone the repository or download the project files.
2. Open `index.html` in a web browser.
3. Use the navigation bar to access the different calculators.

    - **GPA Calculator**
        1. Select the calculation type (Semester GPA or Overall GPA).
        2. Choose the grade system.
        3. If calculating Overall GPA, enter your current GPA and total credits.
        4. Add courses with their respective credits and letter grades.
        5. Click the "Calculate GPA" button to see the result.

    - **Minimum Grade Calculator**
        1. Choose the grade system.
        2. Select the target letter grade.
        3.  Add a required component to calculate the minimum required grade.
        4. Add components with their respective weights and scores.
        5. Click the "Calculate Required Grade" button to see the result.

    - **Erasmus Score Calculator**
        1. Enter your GPA (0-4 scale).
        2. Enter your language score (0-100 scale).
        3. Set the GPA weight percentage.
        4. Click the "Calculate Score" button to see the result.

4. Fill in the required fields and click the calculate button to get the results.

## Dependencies

- [Bootstrap 5.3.2](https://getbootstrap.com/)
- [Bootstrap Bundle JS](https://getbootstrap.com/docs/5.3/getting-started/download/)

## Customization

You can customize the grading systems and other configurations in the `script.js` file. The grading systems are defined as objects:

```javascript
const gradeSystems_4 = {
    system1: { ... },
    system2: { ... },
    system3: { ... }
};

const gradeSystems_100 = {
    system1: { ... },
    system2: { ... },
    system3: { ... }
};
````
Feel free to modify the content as needed.

This should provide clear instructions on how to use each calculator in your project.

