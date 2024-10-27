import React, {useState} from "react";
import {useRouter} from 'next/navigation';
import "./CalorieCalculatorForm.css";
import {color} from "d3-color";

interface CalorieCalculatorFormProps {
    onSwitchForm: (form: string) => void;
}

const CalorieCalculatorForm: React.FC<CalorieCalculatorFormProps> = ({onSwitchForm}) => {
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<string>('');
    const [heightFeet, setHeightFeet] = useState<number | ''>('');
    const [heightInches, setHeightInches] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const [calories, setCalories] = useState<number | null>(null);
    const router = useRouter();

    const handleGoHome = () => {
        onSwitchForm("main");
    };

    const calculateCalories = () => {
        if (
            age &&
            gender &&
            heightFeet !== '' &&
            heightInches !== '' &&
            weight &&
            activityLevel
        ) {
            const heightInInches = Number(heightFeet) * 12 + Number(heightInches);
            const weightInPounds = Number(weight);

            // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * (weightInPounds / 2.205) + 6.25 * (heightInInches * 2.54) - 5 * Number(age) + 5;
            } else {
                bmr = 10 * (weightInPounds / 2.205) + 6.25 * (heightInInches * 2.54) - 5 * Number(age) - 161;
            }

            // Activity factor
            let activityFactor = 1.2; // default sedentary
            switch (activityLevel) {
                case 'sedentary':
                    activityFactor = 1.2;
                    break;
                case 'light':
                    activityFactor = 1.375;
                    break;
                case 'moderate':
                    activityFactor = 1.55;
                    break;
                case 'active':
                    activityFactor = 1.725;
                    break;
                case 'very-active':
                    activityFactor = 1.9;
                    break;
                default:
                    activityFactor = 1.2;
            }

            const totalCalories = Math.round(bmr * activityFactor);
            setCalories(totalCalories);
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="calorie-calculator-form max-w-lg mx-auto p-6">
            <h2 className="card-text">Calorie Calculator</h2>
            <div className="calorie-calculator">
                <div className="form-group mb-4">
                    <label className="block font-semibold mb-1">Age:</label>
                    <div className="input-box">
                        <input
                            type="number"
                            id="age"
                            placeholder="Years old"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="gender" className="block font-semibold mb-1">Gender:</label>
                    <div className="input-box">
                        <select
                            id="gender"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label className="block font-semibold mb-1">Height:</label>
                    <div className="height-inputs flex gap-2 input-box">
                        <input
                            type="number"
                            placeholder="Feet"
                            className="w-1/2 p-2 border border-gray-300 rounded"
                            value={heightFeet}
                            onChange={(e) => setHeightFeet(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            placeholder="Inches"
                            className="w-1/2 p-2 border border-gray-300 rounded"
                            value={heightInches}
                            onChange={(e) => setHeightInches(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="weight" className="block font-semibold mb-1">Weight:</label>
                    <div className="input-box">
                        <input
                            type="number"
                            id="weight"
                            placeholder="Pounds"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="activity-level" className="block font-semibold mb-1">Activity Level:</label>
                    <div className="input-box">
                        <select
                            id="activity-level"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                        >
                            <option className={"color: #ffffff"} value="">Select Activity Level</option>
                            <option value="sedentary">Sedentary (little or no exercise)</option>
                            <option value="light">Light exercise (1-3 days/week)</option>
                            <option value="moderate">Moderate exercise (3-5 days/week)</option>
                            <option value="active">Active (6-7 days/week)</option>
                            <option value="very-active">Very active (physical job or intense exercise)</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={calculateCalories}
                    className="w-full text-white py-2 px-4 rounded calculate-button"
                >
                    Calculate
                </button>
                {calories && (
                    <div className="result mt-6 text-center bg-transparent">
                        <h3 className="text-xl font-semibold mb-2">Daily Calorie Needs:</h3>
                        <p className="text-2xl">{calories} calories/day</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalorieCalculatorForm;