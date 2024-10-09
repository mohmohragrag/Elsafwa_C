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
                weight = (lengthPlate) * (widthPlate ) * (thicknessPlate ) * density; // in kg
                break;

            case "Chequered Steel Plates": // حساب الصاج البقلاوه
                const [lengthCheq, widthCheq, thicknessCheq] = values;
                const adjustedThickness = thicknessCheq + 0.3; // Add 0.3 to thickness
                weight = (lengthCheq) * (widthCheq) * (adjustedThickness ) * density; // in kg
                break;

            case "Seamless Steel Pipes - Circular":
                const [lengthPipe, outerDiameter, thicknessPipe] = values;
                weight = ((outerDiameter - thicknessPipe) * thicknessPipe * 0.025 * (lengthPipe + 20)); // in kg
                break;

            case "Hollow Structural Sections - Square":
                    const [lengthSquare, sideLengthSquare, thicknessSquare] = values;
                    
                    // تحويل الأبعاد من مليمتر إلى متر
                    const lengthM = lengthSquare ;
                    const sideLengthM = sideLengthSquare ;
                    const thicknessM = thicknessSquare ;
    
                    // حساب المساحة الخارجية والداخلية
                    const outerArea = Math.pow(sideLengthM, 2); // مساحة المقطع الخارجي
                    const innerArea = Math.pow(sideLengthM - 2 * thicknessM, 2); // مساحة المقطع الداخلي
    
                    // حساب الوزن
                    weight = lengthM * (outerArea - innerArea) * density; // بالكيلو جرام
                    break;
    

            case "Hollow Structural Sections - Rectangular":
                const [lengthRect, widthRect, heightRect, thicknessRect] = values;
                weight = (lengthRect ) * ((widthRect) * (heightRect ) - ((widthRect - 2 * thicknessRect) ) * ((heightRect - 2 * thicknessRect))) * density; // in kg
                break;

            case "Round Steel Bars":
                const [lengthRound, diameterRound] = values;
                weight = (lengthRound ) * (Math.PI / 4) * Math.pow(diameterRound , 2) * density; // in kg
                break;

            case "Square Steel Bars":
                const [lengthSquareBar, sideLengthSquareBar] = values;
                weight = (lengthSquareBar) * Math.pow(sideLengthSquareBar , 2) * density; // in kg
                break;

            case "Flat Bars":
                const [lengthFlat, widthFlat, thicknessFlat] = values;
                weight = (lengthFlat) * (widthFlat ) * (thicknessFlat ) * density; // in kg
                break;

            case "Equal Angles":
                const [lengthAngle, legLengthAngle, thicknessAngle] = values;
                weight = 2 * (lengthAngle ) * (legLengthAngle  * thicknessAngle ) * density; // in kg
                break;

            case "Unequal Angles":
                const [lengthUnequalAngle, legLength1, legLength2, thicknessUnequal] = values;
                weight = (lengthUnequalAngle ) *
                    ((legLength1  * thicknessUnequal) +
                        (legLength2 * thicknessUnequal ) -
                        Math.pow(thicknessUnequal , 2)) * density; // in kg
                break;

            case "T-profile":
                const [lengthT, widthT, heightT, thicknessT] = values;
                weight = (lengthT ) * ((widthT  * heightT ) - ((widthT - thicknessT)  * (heightT - thicknessT) )) * density; // in kg
                break;

            case "Hexagonal Sections":
                const [lengthHexagon, flatToFlatDistance] = values;
                const sideLength = flatToFlatDistance / Math.sqrt(3); // Calculate side length from flat-to-flat distance
                const areaHexagon = (3 * Math.sqrt(3) / 2) * Math.pow(sideLength, 2); // in m²
                weight = (lengthHexagon ) * areaHexagon * density; // kg
                break;
        }

        document.getElementById("result").innerHTML = `Weight: ${weight.toFixed(2)} kg`; // Show weight in kg
    } else {
        document.getElementById("result").innerHTML = "Please select a steel section type.";
    }
}
