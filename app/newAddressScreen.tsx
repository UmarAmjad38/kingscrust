// app/newAddressScreen.tsx (or (modals)/newAddressScreen.tsx)
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAddress } from '../context/AddressContext';
import { ChevronLeft, MapPin, Home as HomeIcon, Briefcase, Tag } from 'lucide-react-native';

const colors = {
    primary: '#F15B25',
    primaryLight: '#FFEFEA',
    accent: '#F9B900',
    text: '#212121',
    textSecondary: '#757575',
    textLight: '#9E9E9E',
    background: '#FFFFFF',
    cardBackground: '#F5F5F5',
    border: '#E0E0E0',
    white: '#FFFFFF',
    black: '#000000',
    buttonTextDark: '#333333',
    disabledBackground: '#E0E0E0', // Added for disabled button background
};

const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

const borderRadius = {
    sm: 8,
    md: 12,
    lg: 20,
};

type AddressLabel = 'Home' | 'Work' | 'Other';

interface LabelInfo {
    id: AddressLabel;
    icon: React.ElementType;
}

const addressLabels: LabelInfo[] = [
    { id: 'Home', icon: HomeIcon },
    { id: 'Work', icon: Briefcase },
    { id: 'Other', icon: Tag },
];

export default function NewAddressScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ address: string; latitude: string; longitude: string }>();
    const { addSavedAddress } = useAddress();

    const [houseFlatNo, setHouseFlatNo] = useState('');
    const [selectedLabel, setSelectedLabel] = useState<AddressLabel | null>(null);

    const latitude = parseFloat(params.latitude ?? '0');
    const longitude = parseFloat(params.longitude ?? '0');

    const handleAddAddress = () => {
        if (!params.address || !latitude || !longitude) {
            Alert.alert("Error", "Address data is incomplete. Please go back and select an address again.");
            return;
        }
        if (!selectedLabel) {
            Alert.alert("Label Required", "Please select a label (Home, Work, or Other) for this address.");
            return;
        }

        const newAddress = {
            id: '',
            label: selectedLabel,
            fullAddress: params.address,
            details: houseFlatNo.trim(),
            latitude: latitude,
            longitude: longitude,
        };

        addSavedAddress(newAddress);

        if (router.canGoBack()) {
            router.back();
            setTimeout(() => {
                if (router.canGoBack()) {
                    router.back();
                }
            }, 150);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Address</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                       <MapPin size={18} color={colors.textSecondary} />
                       <Text style={styles.sectionTitle}>Delivery Address</Text>
                    </View>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressText}>
                            {params.address ?? 'Address not available'}
                        </Text>
                    </View>
                </View>

                 <View style={styles.section}>
                     <View style={styles.sectionHeader}>
                        <HomeIcon size={18} color={colors.textSecondary} />
                        <Text style={styles.sectionTitle}>Apartment / House / Office Details</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="E.g., Flat No. 101, Tower B, Silicon Towers"
                        value={houseFlatNo}
                        onChangeText={setHouseFlatNo}
                        placeholderTextColor={colors.textLight}
                    />
                </View>

                <View style={styles.section}>
                     <View style={styles.sectionHeader}>
                        <Tag size={18} color={colors.textSecondary} />
                        <Text style={styles.sectionTitle}>Save Address As</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        {addressLabels.map(({ id: label, icon: Icon }) => (
                            <TouchableOpacity
                                key={label}
                                style={[
                                    styles.labelButton,
                                    selectedLabel === label && styles.labelButtonSelected,
                                ]}
                                onPress={() => setSelectedLabel(label)}
                            >
                                <Icon
                                    size={18}
                                    color={selectedLabel === label ? colors.primary : colors.textSecondary}
                                    style={styles.labelIcon}
                                />
                                <Text
                                    style={[
                                        styles.labelButtonText,
                                        selectedLabel === label && styles.labelButtonTextSelected,
                                    ]}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.addButton, !selectedLabel && styles.addButtonDisabled]}
                    onPress={handleAddAddress}
                    disabled={!selectedLabel}
                >
                    <Text style={styles.addButtonText}>SAVE ADDRESS</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Ensures the root view is white
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '600',
        color: colors.text,
    },
    headerPlaceholder: {
        width: 28 + spacing.xs * 2 + spacing.sm,
    },
    scrollView: {
        flex: 1, // Allows ScrollView to take up available space
        backgroundColor: colors.background, // Ensures ScrollView background is white
    },
    scrollViewContent: {
        paddingBottom: spacing.lg,
        flexGrow: 1, // Makes content area try to fill the ScrollView height
        backgroundColor: colors.background, // Ensures content container background is white
    },
    section: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
     sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textSecondary,
        marginLeft: spacing.sm,
    },
    addressCard: {
        backgroundColor: colors.cardBackground,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addressText: {
        fontSize: 15,
        color: colors.text,
        lineHeight: 22,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        fontSize: 15,
        color: colors.text,
        marginTop: spacing.xs,
    },
    labelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.xs,
        gap: spacing.sm,
    },
    labelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,
    },
    labelButtonSelected: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
    },
    labelIcon: {
        marginRight: spacing.xs,
    },
    labelButtonText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    labelButtonTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    footer: {
        padding: spacing.md,
        paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background, // Ensures the footer area is white
    },
    addButton: {
        backgroundColor: colors.accent,
        paddingVertical: 15,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonDisabled: {
      backgroundColor: colors.disabledBackground, // Use defined disabled color
    },
    addButtonText: {
        color: colors.buttonTextDark,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});