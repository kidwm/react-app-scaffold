import { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import { useToggle } from 'utils/state';

import styles from './NumberField.css';

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

const NumberField = ({
    className,
    name, placeholder,
    min, max, step = 1,
    value, defaultValue,
    disabled, required, readOnly,
    onChange, onBlur,
}) => {
    const inputRef = useRef();
    // update current value to disable spin button when reach the limit
    const [ , forceUpdate ] = useToggle(false);

    const handleChange = event => {
        forceUpdate();
        if (typeof onChange === 'function') {
            onChange(event);
        }
    }

    const handleBlur = event => {
        if (typeof onBlur === 'function') {
            onBlur(event);
        }
    }

    const spinStep = useCallback(direction => {
        let value = inputRef.current.value;
        inputRef.current[direction === 'up' ? 'stepUp' : 'stepDown']();
        if (value !== inputRef.current.value) {
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, []);

    const decrease = useCallback(() => spinStep('down'), [spinStep]);

    const increase = useCallback(() => spinStep('up'), [spinStep]);

    useEffect(() => { forceUpdate() }, [forceUpdate]) // disable button with defaultValue

    const currentValue = parseInt(inputRef.current?.value, 10);

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
                placeholder={placeholder}
                step={step}
                disabled={disabled}
                required={required}
                readOnly={readOnly}
                onBlur={handleBlur}
                onChange={handleChange}
            />
            <SpinButton disabled={disabled || currentValue <= min} spin={decrease}>
                <Icon name="remove" />
            </SpinButton>
            <SpinButton disabled={disabled || currentValue >= max} spin={increase}>
                <Icon name="add" />
            </SpinButton>
        </div>
    )
}

NumberField.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
}

export default NumberField;
