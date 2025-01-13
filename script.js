// Grade Systems Configuration
const gradeSystems_4 = {
    system1: {
        AA: 4.0,
        BA: 3.5,
        BB: 3.0,
        CB: 2.5,
        CC: 2.0,
        DC: 1.5,
        DD: 1.0,
        FD: 0.5,
        FF: 0.0
    },
    system2: {
        AA: 4.0,
        AB: 3.7,
        BA: 3.3,
        BB: 3.0,
        BC: 2.7,
        CB: 2.3,
        CC: 2.0,
        CD: 1.7,
        DC: 1.3,
        DD: 1.0,
        FF: 0.0
    },
    system3: {
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'D-': 0.7,
        'F': 0.0
    }
};

const gradeSystems_100 = {
    "system1": {
        "AA": { min: 90, max: 100 },
        "BA": { min: 85, max: 89 },
        "BB": { min: 80, max: 84 },
        "CB": { min: 75, max: 79 },
        "CC": { min: 70, max: 74 },
        "DC": { min: 65, max: 69 },
        "DD": { min: 60, max: 64 },
        "FD": { min: 50, max: 59 },
        "FF": { min: 0, max: 49 }
    },
    "system2": {
        "AA": { min: 84, max: 100 },
        "AB": { min: 77, max: 83 },
        "BA": { min: 71, max: 76 },
        "BB": { min: 66, max: 70 },
        "BC": { min: 61, max: 65 },
        "CB": { min: 56, max: 60 },
        "CC": { min: 50, max: 55 },
        "CD": { min: 46, max: 49 },
        "DC": { min: 40, max: 45 },
        "DD": { min: 33, max: 39 },
        "FF": { min: 0, max: 32 }
    },
    "system3": {
        "A": { min: 95, max: 100 },
        "A-": { min: 90, max: 94 },
        "B+": { min: 86, max: 89 },
        "B": { min: 82, max: 85 },
        "B-": { min: 78, max: 81 },
        "C+": { min: 74, max: 77 },
        "C": { min: 70, max: 73 },
        "C-": { min: 63, max: 69 },
        "D+": { min: 57, max: 62 },
        "D": { min: 51, max: 56 },
        "F": { min: 0, max: 50 }
    }
};

class Calculator {
    validateInput(value) {
        return !isNaN(value) && value !== null && value !== '';
    }

    displayResult(result, elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = result;
        }
    }
}

class GPACalculator extends Calculator {
    constructor(gradeSystem) {
        super();
        this.courses = [];
        this.currentGPA = 0;
        this.totalCredits = 0;
        this.gradeSystem = gradeSystem;
    }

    addCourse(credit, grade) {
        if (!this.validateInput(credit) || !grade) return false;
        const numericGrade = gradeSystems_4[this.gradeSystem][grade];
        if (numericGrade !== undefined) {
            this.courses.push({ credit, grade: numericGrade });
            return true;
        }
        return false;
    }

    calculateSemesterGPA() {
        let semesterPoint = 0;
        let semesterCredit = 0;

        this.courses.forEach(course => {
            semesterPoint += course.credit * course.grade;
            semesterCredit += course.credit;
        });

        return semesterCredit > 0 ? semesterPoint / semesterCredit : 0;
    }

    calculateOverallGPA() {
        const semesterGPA = this.calculateSemesterGPA();
        const semesterCredits = this.courses.reduce((sum, course) => sum + course.credit, 0);

        const totalPoints = (this.currentGPA * this.totalCredits) + (semesterGPA * semesterCredits);
        const newTotalCredits = this.totalCredits + semesterCredits;

        return newTotalCredits > 0 ? totalPoints / newTotalCredits : 0;
    }
}

class MinimumGradeCalculator extends Calculator {
    constructor(gradeSystem) {
        super();
        this.components = [];
        this.gradeSystem = gradeSystem;
        this.targetLetterGrade = '';
    }

    addComponent(weight, score) {
        if (score === undefined || this.validateInput(weight)) {
            this.components.push({ weight, score });
            return true;
        }
        return false;
    }

    getTotalWeight() {
        return this.components.reduce((sum, comp) => sum + (parseFloat(comp.weight) || 0), 0);
    }

    calculateMinimumRequired() {
        const totalWeight = this.getTotalWeight();
        if (Math.abs(totalWeight - 100) > 0.01) return null;

        let currentTotal = 0;
        const targetComponent = this.components.find(comp => comp.score === undefined);

        if (!targetComponent) return null;

        const targetWeight = parseFloat(targetComponent.weight);

        this.components.forEach(comp => {
            if (comp.score !== undefined) {
                currentTotal += (parseFloat(comp.weight) * parseFloat(comp.score)) / 100;
            }
        });

        const targetGradeRange = gradeSystems_100[this.gradeSystem][this.targetLetterGrade];
        if (!targetGradeRange) return null;

        const minRequiredGrade = targetGradeRange.min;
        const requiredScore = ((minRequiredGrade - currentTotal) * 100) / targetWeight;

        return requiredScore;
    }

    isPossibleToAchieve() {
        const requiredScore = this.calculateMinimumRequired();
        if (requiredScore <= 100 && requiredScore >= 0) return true;
        else return false;
    }

    getGradeRange(letterGrade) {
        const range = gradeSystems_100[this.gradeSystem][letterGrade];
        return range ? `${range.min}-${range.max}` : '';
    }
}

class ErasmusScoreCalculator extends Calculator {
    calculateErasmusScore(gpa, languageScore, gpaWeight) {
        if (!this.validateInput(gpa) || !this.validateInput(languageScore) || !this.validateInput(gpaWeight)) {
            return null;
        }

        const languageWeight = 100 - gpaWeight;
        const normalizedGPA = (gpa / 4) * 100;
        return (normalizedGPA * gpaWeight + languageScore * languageWeight) / 100;
    }
}

// DOM manipulation and event handling
document.addEventListener('DOMContentLoaded', function () {
    // Function to update grade options
    function updateGradeOptions(gradeSystem, selectElement) {
        if (!selectElement) return;

        const grades = Object.keys(gradeSystems_4[gradeSystem] || {});
        selectElement.innerHTML = '';

        grades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            selectElement.appendChild(option);
        });
    }

    // Initialize all forms
    const forms = {
        gpa: document.getElementById('gpaForm'),
        minGrade: document.getElementById('minGradeForm'),
        erasmus: document.getElementById('erasmusForm')
    };

    // GPA Calculator initialization
    if (forms.gpa) {
        const gradeSystem = document.getElementById('gradeSystem');
        const gpaType = document.getElementById('gpaType');
        const currentGpaSection = document.getElementById('currentGpaSection');
        const addCourseBtn = document.getElementById('addCourse');

        if (gradeSystem) {
            updateGradeOptions(gradeSystem.value, document.querySelector('.grade'));
            gradeSystem.addEventListener('change', function () {
                document.querySelectorAll('.grade').forEach(select => {
                    updateGradeOptions(this.value, select);
                });
            });
        }

        if (gpaType && currentGpaSection) {
            gpaType.addEventListener('change', function () {
                currentGpaSection.style.display = this.value === 'overall' ? 'block' : 'none';
            });
        }

        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', function () {
                const courseList = document.getElementById('courseList');
                if (!courseList) return;

                const template = document.querySelector('.course-entry');
                if (!template) return;

                const newCourse = template.cloneNode(true);
                newCourse.querySelector('.credit').value = '';
                updateGradeOptions(gradeSystem.value, newCourse.querySelector('.grade'));
                courseList.appendChild(newCourse);
            });
        }

        forms.gpa.addEventListener('submit', function (e) {
            e.preventDefault();
            const calculator = new GPACalculator(gradeSystem.value);

            if (gpaType.value === 'overall') {
                calculator.currentGPA = parseFloat(document.getElementById('currentGpa').value) || 0;
                calculator.totalCredits = parseFloat(document.getElementById('totalCredits').value) || 0;
            }

            document.querySelectorAll('.course-entry').forEach(course => {
                const credit = parseFloat(course.querySelector('.credit').value);
                const grade = course.querySelector('.grade').value;
                calculator.addCourse(credit, grade);
            });

            const gpa = gpaType.value === 'overall' ? calculator.calculateOverallGPA() : calculator.calculateSemesterGPA();
            calculator.displayResult(
                `<div class="alert alert-success">Your GPA: ${gpa.toFixed(2)}</div>`,
                'gpaResult'
            );
        });
    }

    // Minimum Grade Calculator initialization
    if (forms.minGrade) {


        const minGradeSystem = document.getElementById('minGradeSystem');
        const targetLetterGrade = document.getElementById('targetLetterGrade');
        const addComponentBtn = document.getElementById('addComponent');
        const addTargetComponentBtn = document.getElementById('addTargetComponent');
        const componentList = document.getElementById('componentList');
        const totalWeightSpan = document.getElementById('totalWeight');
        const remainingWeightSpan = document.getElementById('remainingWeight');
        const weightProgressBar = document.getElementById('weightProgressBar');

        // Function to update grade options in the dropdown
        function updateMinGradeOptions() {
            if (!minGradeSystem || !targetLetterGrade) return;

            const grades = Object.keys(gradeSystems_100[minGradeSystem.value] || {});
            targetLetterGrade.innerHTML = '';

            grades.forEach(grade => {
                const calculator = new MinimumGradeCalculator(minGradeSystem.value);
                const range = calculator.getGradeRange(grade);
                const option = document.createElement('option');
                option.value = grade;
                option.textContent = `${grade} (${range})`;
                targetLetterGrade.appendChild(option);
            });
        }

        // Function to update weight displays
        function updateWeightDisplay() {
            let total = 0;
            document.querySelectorAll('.component-entry:not(.target-component) .weight').forEach(input => {
                total += parseFloat(input.value) || 0;
            });

            const remaining = 100 - total;

            if (totalWeightSpan) {
                totalWeightSpan.textContent = total.toFixed(1);
            }
            if (remainingWeightSpan) {
                remainingWeightSpan.textContent = remaining.toFixed(1);
            }
            if (weightProgressBar) {
                weightProgressBar.style.width = `${total}%`;
                weightProgressBar.className = 'progress-bar';

                if (total > 100) {
                    weightProgressBar.classList.add('bg-danger');
                } else if (Math.abs(total - 100) < 0.01) {
                    weightProgressBar.classList.add('bg-success');
                } else {
                    weightProgressBar.classList.add('bg-info');
                }
            }

            const targetWeight = document.querySelector('.target-component .weight');
            if (targetWeight) {
                targetWeight.value = remaining.toFixed(1);
            }
        }

        // Initialize grade options
        if (minGradeSystem) {
            updateMinGradeOptions();
            minGradeSystem.addEventListener('change', updateMinGradeOptions);
        }

        // Add regular component button handler
        if (addComponentBtn && componentList) {
            addComponentBtn.addEventListener('click', function () {
                const newComponent = document.createElement('div');
                newComponent.className = 'component-entry mb-3';
                newComponent.innerHTML = `
                    <div class="row">
                        <div class="col">
                            <input type="number" class="form-control weight" placeholder="Weight %" 
                                   min="0" max="100" required>
                        </div>
                        <div class="col">
                            <input type="number" class="form-control score" placeholder="Score" 
                                   min="0" max="100" step="0.1" required>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-danger remove-component">×</button>
                        </div>
                    </div>
                `;

                const weightInput = newComponent.querySelector('.weight');
                if (weightInput) {
                    weightInput.addEventListener('input', updateWeightDisplay);
                }

                const removeBtn = newComponent.querySelector('.remove-component');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function () {
                        newComponent.remove();
                        updateWeightDisplay();
                    });
                }

                componentList.appendChild(newComponent);
                updateWeightDisplay();
            });
        }

        // Add target component button handler
        if (addTargetComponentBtn && componentList) {
            addTargetComponentBtn.addEventListener('click', function () {
                const targetComponent = document.createElement('div');
                targetComponent.className = 'component-entry target-component mb-3';
                targetComponent.innerHTML = `
                    <div class="row">
                        <div class="col">
                            <input type="number" class="form-control weight" placeholder="Required Weight %" 
                                   readonly>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" value="Required Score" readonly>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-danger remove-component">×</button>
                        </div>
                    </div>
                `;

                const removeBtn = targetComponent.querySelector('.remove-component');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function () {
                        targetComponent.remove();
                        addTargetComponentBtn.disabled = false;
                        updateWeightDisplay();
                    });
                }

                componentList.appendChild(targetComponent);
                updateWeightDisplay();
                this.disabled = true;
            });
        }

        // Form submission handler
        forms.minGrade.addEventListener('submit', function (e) {
            e.preventDefault();
            const calculator = new MinimumGradeCalculator(minGradeSystem.value);
            calculator.targetLetterGrade = targetLetterGrade.value;

            // Add regular components
            document.querySelectorAll('.component-entry:not(.target-component)').forEach(component => {
                const weight = parseFloat(component.querySelector('.weight').value);
                const score = parseFloat(component.querySelector('.score').value);
                if (!isNaN(weight) && !isNaN(score)) {
                    calculator.addComponent(weight, score);
                }
            });

            // Add target component
            const targetComponent = document.querySelector('.target-component');
            if (targetComponent) {
                const weight = parseFloat(targetComponent.querySelector('.weight').value);
                calculator.addComponent(weight, undefined);
            }

            const totalWeight = calculator.getTotalWeight();
            const requiredGrade = calculator.calculateMinimumRequired();
            const isPossible = calculator.isPossibleToAchieve();

            let resultMessage;
            if (Math.abs(totalWeight - 100) > 0) {
                resultMessage = '<div class="alert alert-danger">Total weight must equal 100%</div>';
            } else if (!isPossible) {
                resultMessage = '<div class="alert alert-danger">Target grade is not possible to achieve</div>';
            } else {
                resultMessage = `
                    <div class="alert alert-success">
                        Required score: ${requiredGrade.toFixed(2)}<br>
                        <small class="text-muted">This is the minimum score needed on the remaining component 
                        to achieve your target grade.</small>
                    </div>`;
            }

            calculator.displayResult(resultMessage, 'minGradeResult');
        });


        // ... (rest of the code remains the same)
    }

    // Erasmus Score Calculator initialization
    if (forms.erasmus) {
        forms.erasmus.addEventListener('submit', function (e) {
            e.preventDefault();
            const calculator = new ErasmusScoreCalculator();

            const gpa = parseFloat(document.getElementById('erasmusGpa').value);
            const languageScore = parseFloat(document.getElementById('languageScore').value);
            const gpaWeight = parseFloat(document.getElementById('gpaWeight').value);

            const score = calculator.calculateErasmusScore(gpa, languageScore, gpaWeight);

            if (score !== null) {
                calculator.displayResult(
                    `<div class="alert alert-success">Your Erasmus Score: ${score.toFixed(2)}</div>`,
                    'erasmusResult'
                );
            } else {
                calculator.displayResult(
                    '<div class="alert alert-danger">Please fill in all fields with valid numbers</div>',
                    'erasmusResult'
                );
            }
        });
    }
});