import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

interface PlatformDatePickerProps {
    show: boolean;
    mode: 'date' | 'time';
    value: Date;
    minimumDate?: Date;
    onChange: (event: any, date?: Date) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const toDateValue = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const toTimeValue = (d: Date) =>
    `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const PlatformDatePicker: React.FC<PlatformDatePickerProps> = ({
    show,
    mode,
    value,
    minimumDate,
    onChange,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
            (inputRef.current as any).showPicker?.();
        }
    }, [show]);

    if (!show) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            onChange({});
            return;
        }
        const newDate = new Date(value);
        if (mode === 'date') {
            const [year, month, day] = e.target.value.split('-').map(Number);
            newDate.setFullYear(year, month - 1, day);
        } else {
            const [hours, minutes] = e.target.value.split(':').map(Number);
            newDate.setHours(hours, minutes, 0, 0);
        }
        onChange({}, newDate);
    };

    return (
        <View style={styles.overlay}>
            {/* Backdrop */}
            <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                activeOpacity={1}
                onPress={() => onChange({})}
            />
            {/* Picker card */}
            <View style={styles.card}>
                <Text style={styles.title}>
                    {mode === 'date' ? 'Select Date' : 'Select Time'}
                </Text>
                <input
                    ref={inputRef}
                    type={mode}
                    defaultValue={mode === 'date' ? toDateValue(value) : toTimeValue(value)}
                    min={mode === 'date' && minimumDate ? toDateValue(minimumDate) : undefined}
                    onChange={handleChange}
                    style={{
                        fontSize: '18px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '2px solid #10B981',
                        outline: 'none',
                        color: '#1F2937',
                        backgroundColor: '#F9FAFB',
                        cursor: 'pointer',
                        width: '100%',
                        boxSizing: 'border-box',
                    } as React.CSSProperties}
                />
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => onChange({})}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: 300,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
        zIndex: 10000,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    cancelText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
});
