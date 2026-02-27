import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface PlatformDatePickerProps {
    show: boolean;
    mode: 'date' | 'time';
    value: Date;
    minimumDate?: Date;
    onChange: (event: any, date?: Date) => void;
}

export const PlatformDatePicker: React.FC<PlatformDatePickerProps> = ({
    show,
    mode,
    value,
    minimumDate,
    onChange,
}) => {
    if (!show) return null;
    return (
        <DateTimePicker
            value={value}
            mode={mode}
            display="default"
            onChange={onChange}
            minimumDate={minimumDate}
        />
    );
};
