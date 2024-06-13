interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <label className="custom-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="checkmark"></span>
        </label>
    );
}
export default Checkbox;
