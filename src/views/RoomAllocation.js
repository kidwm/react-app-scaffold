import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CustomInputNumber from 'components/CustomInputNumber';

import styles from './RoomAllocation.css';

const Room = ({
    index,
    capacity = 4,
    adult,
    child,
    queue,
    onChange,
    disabled,
}) => {
    const updateNumber = useCallback(event => {
        const number = parseInt(event.target.value, 10);
        if (Number.isInteger(number)) {
            if (typeof onChange === 'function') {
                onChange(Object.assign({ index, adult, child }, {
                    [event.target.name]: number
                }))
            }
        }
    }, [ index, adult, child, onChange ]);

    return (
        <fieldset
            className={styles.room}
            onChange={updateNumber}
            disabled={disabled}
        >
            <p>房間：<output>{ adult + child }</output> 人</p>
            <label>
                <div>
                    大人
                    <span className={styles.age}>年齡 20+</span>
                </div>
                <CustomInputNumber
                    name="adult"
                    value={adult}
                    min={1}
                    max={Math.min(capacity - child, adult + queue)}
                />
            </label>
            <label>
                小孩
                <CustomInputNumber
                    name="child"
                    value={child}
                    min={0}
                    max={Math.min(capacity - adult, child + queue)}
                />
            </label>
        </fieldset>
    )
}

Room.propTypes = {
    index: PropTypes.number.isRequired,
    capacity: PropTypes.number,
    queue: PropTypes.number,
    adult: PropTypes.number,
    child: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
}

const RoomAllocation = ({
    className,
    guest,
    room,
    onChange
}) => {
    const [result, setResult] = useState(
        [...Array(room).keys()].map(() => ({
            adult: 1, child: 0
        }))
    );

    const updateRoom = useCallback(({ index, adult, child }) => {
        setResult(state => {
            const nextState = [...state];
            nextState[index] = { adult, child };
            return nextState;
        });
    }, []);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(result);
        }
    }, [onChange, result]);

    const number = result.reduce((sum, { adult, child }) => sum + adult + child, 0);
    const queue = guest - number;

    return (
        <form className={[styles.container, className].filter(Boolean).join(' ')}>
            <p className={styles.statistic}>
                住客人數： { guest } 人 / { room } 房
            </p>
            <p className={styles.queue}>
                尚未分配人數： <output>{ queue }</output> 人
            </p>
            {
                result.map(({ adult, child }, index) => {
                    return (
                        <Room
                            key={index}
                            index={index}
                            queue={queue}
                            adult={adult}
                            child={child}
                            onChange={updateRoom}
                            disabled={guest === room}
                        />
                    )
                })
            }
        </form>
    )
}


RoomAllocation.propTypes = {
    className: PropTypes.string,
    guest: PropTypes.number.isRequired,
    room: PropTypes.number.isRequired,
    onChange: PropTypes.func,
}

export default RoomAllocation;