import { useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './CustomInputNumber.css';


const SpinButton = ({
    disabled,
    spin,
    children
}) => {
    const timerRef = useRef();

    const handlePress = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            if (typeof spin === 'function') {
                spin();
            }
        }, 200);
    }

    const handleRelease = () => {
        clearInterval(timerRef.current);
    }

    useEffect(() => {
        if (disabled) {
            handleRelease()
        }
    }, [disabled])

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={spin}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
        >
            { children }
        </button>
    )
}

SpinButton.propTypes = {
    disabled: PropTypes.bool,
    spin: PropTypes.func,
    children: PropTypes.node,
}

const CustomInputNumber = ({
    className,
    name,
    min,
    max,
    step = 1,
    value,
    defaultValue,
    disabled,
    required,
    readOnly,
    onChange,
    onBlur,
}) => {
    const inputRef = useRef();
    const [ , forceUpdate ] = useState();

    const handleChange = event => {
        if (typeof onChange === 'function') {
            onChange(event);
        }
    }

    const handleBlur = event => {
        if (typeof onBlur === 'function') {
            onBlur(event);
        }
    }

    const dispatchSpin = action => {
        let value = inputRef.current.value;
        action();
        if (value !== inputRef.current.value) {
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            forceUpdate(state => !state); // update current value to disable spin button when reach the limit
        }
    }

    const decrease = useCallback(() => {
        dispatchSpin(() => inputRef.current.stepDown());
    }, []);

    const increase = useCallback(() => {
        dispatchSpin(() => inputRef.current.stepUp());
    }, []);

    const currentValue = value ?? parseInt(inputRef.current?.value, 10);

    return (
        <div className={[styles.container, className].filter(Boolean).join(' ')}>
            <input /* locate input before buttons to get focused when click on wrapping <label> */
                ref={inputRef}
                type="number"
                name={name}
                min={min}
                max={max}
                value={value}
                defaultValue={defaultValue}
                step={step}
                disabled={disabled}
                required={required}
                readOnly={readOnly}
                onBlur={handleBlur}
                onChange={handleChange}
            />
            <SpinButton disabled={disabled || currentValue === min} spin={decrease}>
                -
            </SpinButton>
            <SpinButton disabled={disabled || currentValue === max} spin={increase}>
                +
            </SpinButton>
        </div>
    )
}

CustomInputNumber.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
}

export default CustomInputNumber;