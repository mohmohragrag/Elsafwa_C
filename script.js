const steelSections = {
    "Steel Plates and Sheets": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Chequered Steel Plates": ["Length (mm)", "Width (mm)", "Thickness (mm)"], // الصاج البقلاوه
    "Seamless Steel Pipes - Circular": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Square": ["Length (mm)", "Side Length (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Rectangular": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Round Steel Bars": ["Length (mm)", "Diameter (mm)"],
    "Square Steel Bars": ["Length (mm)", "Side Length (mm)"],
    "Flat Bars": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Equal Angles": ["Length (mm)", "Leg Length (mm)", "Thickness (mm)"],
    "Unequal Angles": ["Length (mm)", "Leg Length 1 (mm)", "Leg Length 2 (mm)", "Thickness (mm)"],
    "T-profile": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"], // Added dimensions for T-profile
    "Hexagonal Sections": ["Length (mm)", "Outer (mm)"]
};

function showFields() {
    const sectionType = document.getElementById("sectionType").value;
    const fieldsContainer = document.getElementById("fields");
    const sectionImage = document.getElementById("sectionImage");

    fieldsContainer.innerHTML = '';
    sectionImage.style.display = "none";

    if (sectionType === "UPN") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/upn/index.html";
    } else if (sectionType === "IPN") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/ipn/index.html";
    } else if (sectionType === "IPE") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/ipe/index.html";
    } else if (sectionType === "HEA") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/hea/index.html";
    } else if (sectionType === "HEB") {
        window.location.href = "https://mohmohragrag.github.io/Elsafwa_Calculator/heb/index.html";
    } else if (sectionType && steelSections[sectionType]) {
        steelSections[sectionType].forEach(field => {
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.placeholder = field;
            inputField.oninput = calculateWeight; // Add input event listener
            fieldsContainer.appendChild(inputField);
        });

        if (sectionType === "T-profile") {
            sectionImage.src = "images/t_profile.png";
        } else {
            sectionImage.src = `images/${sectionType.replace(/\s+/g, '_').toLowerCase()}.png`;
        }
        sectionImage.style.display = "block"; // Show image
    } else {
        alert("Invalid section type selected. Please choose a valid option.");
    }
}

function calculateWeight() {
    const sectionType = document.getElementById("sectionType").value;
    const fields = document.getElementById("fields").children;
    const density = 7.850; // kg/m³ for steel
    let weight = 0;

    if (sectionType && fields.length > 0) {
        const values = Array.from(fields).map(field => parseFloat(field.value));

        if (values.some(value => isNaN(value) || value <= 0)) {
            document.getElementById("result").innerHTML = "Please enter valid dimensions for all fields. Values must be greater than zero.";
            return;
        }

        switch (sectionType) {
            case "Steel Plates and Sheets":
                const [lengthPlate, widthPlate, thicknessPlate] = values;
                weight = (lengthPlate / 1000) * (widthPlate / 1000) * (thicknessPlate / 1000) * density; // Convert mm to m
                break;

            case "Chequered Steel Plates": // حساب الصاج البقلاوه
                const [lengthCheq, widthCheq, thicknessCheq] = values;
                const adjustedThickness = (thicknessCheq + 0.3) / 1000; // Convert to meters
                weight = (lengthCheq / 1000) * (widthCheq / 1000) * (adjustedThickness) * density; // in kg
                break;

            case "Seamless Steel Pipes - Circular":
                const [lengthPipe, outerDiameter, thicknessPipe] = values;
                weight = ((outerDiameter - thicknessPipe) / 1000) * (thicknessPipe / 1000) * 0.025 * ((lengthPipe + 20) / 1000); // Convert mm to m
                break;

            case "Hollow Structural Sections - Square":
                const [lengthSquare, sideLengthSquare, thicknessSquare] = values;
                const lengthM = lengthSquare / 1000; // Convert mm to m
                const sideLengthM = sideLengthSquare / 1000; // Convert mm to m
                const thicknessM = thicknessSquare / 1000; // Convert mm to m
                const outerArea = Math.pow(sideLengthM, 2); // مساحة المقطع الخارجي
                const innerArea = Math.pow(sideLengthM - 2 * thicknessM, 2); // مساحة المقطع الداخلي
                weight = lengthM * (outerArea - innerArea) * density; // بالكيلو جرام
                break;

            case "Hollow Structural Sections - Rectangular":
                const [lengthRect, widthRect, heightRect, thicknessRect] = values;
                weight = (lengthRect / 1000) * ((widthRect / 1000) * (heightRect / 1000) - ((widthRect - 2 * thicknessRect) / 1000) * ((heightRect - 2 * thicknessRect) / 1000)) * density; // in kg
                break;

            case "Round Steel Bars":
                const [lengthRound, diameterRound] = values;
                weight = (lengthRound / 1000) * (Math.PI / 4) * Math.pow((diameterRound / 1000), 2) * density; // in kg
                break;

            case "Square Steel Bars":
                const [lengthSquareBar, sideLengthSquareBar] = values;
                weight = (lengthSquareBar / 1000) * Math.pow((sideLengthSquareBar / 1000), 2) * density; // in kg
                break;

            case "Flat Bars":
                const [lengthFlat, widthFlat, thicknessFlat] = values;
                weight = (lengthFlat / 1000) * (widthFlat / 1000) * (thicknessFlat / 1000) * density; // in kg
                break;

            case "Equal Angles":
                const [lengthAngle, legLengthAngle, thicknessAngle] = values;
                weight = 2 * (lengthAngle / 1000) * (legLengthAngle / 1000 * thicknessAngle / 1000) * density; // in kg
                break;

            case "Unequal Angles":
                const [lengthUnequalAngle, legLength1, legLength2, thicknessUnequal] = values;
                weight = (lengthUnequalAngle / 1000) *
                    ((legLength1 / 1000 * thicknessUnequal / 1000) +
                        (legLength2 / 1000 * thicknessUnequal / 1000) -
                        Math.pow(thicknessUnequal / 1000, 2)) * density; // in kg
                break;

            case "T-profile":
                const [lengthT, widthT, heightT, thicknessT] = values;
                weight = (lengthT / 1000) * ((widthT / 1000 * heightT / 1000) - ((widthT - thicknessT) / 1000 * (heightT - thicknessT) / 1000)) * density; // in kg
                break;

            case "Hexagonal Sections":
                const [lengthHexagon, flatToFlatDistance] = values;
                const sideLength = flatToFlatDistance / Math.sqrt(3); // Calculate side length from flat-to-flat distance
                const areaHexagon = (3 * Math.sqrt(3) / 2) * Math.pow(sideLength / 1000, 2); // Convert to meters
                weight = lengthHexagon * areaHexagon * density; // in kg
                break;

            default:
                document.getElementById("result").innerHTML = "Please select a valid section type.";
                return;
        }
    }

    document.getElementById("result").innerHTML = `Weight: ${weight.toFixed(2)} kg`; // Show weight in kg
}
