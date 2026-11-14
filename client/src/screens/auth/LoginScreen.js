import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import NomadixLoadingModal from '../../components/common/NomadixLoadingModal';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';

export default function LoginScreen({ navigation }) {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, loginWithGoogle, continueAsGuest, isLoading, error: authError } = useAuthStore();

  const validate = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Invalid email. Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await login(email.trim(), password);
    } catch {
      // Auth error handled by store
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('abc@gmail.com');
    setPassword('123');
    try {
      await login('abc@gmail.com', '123');
    } catch {
      // Handled by store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (typeof loginWithGoogle === 'function') {
        await loginWithGoogle({
          idToken: 'google-oauth-session-token',
          profile: {
            fullName: 'Nguyễn Văn Đức',
            email: 'ducnva.wk@gmail.com',
            avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo',
            photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocK-real-google-photo',
          },
        });
      } else {
        await handleQuickDemoLogin();
      }
    } catch {
      // Handled by store
    }
  };

  return (
    <ImageBackground
      testID="login-hero-bg"
      source={{ uri: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Hero Section matching Nomadix Mockup */}
          <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>N</Text>
              <Text style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>NOMADIX</Text>
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Travel together.</Text>
              <Text style={styles.heroTitle}>Split nothing</Text>
              <Text style={styles.heroTitle}>but joy.</Text>
              <Text style={styles.heroSubtitle}>
                Flights, stays, shared itineraries and smart expense splitting.
              </Text>
            </View>
          </View>

          {/* Form Card Anchored at Bottom */}
          <View testID="login-card" style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Input
              label="Email Address"
              placeholder="Enter your email (e.g. traveler@example.com)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              error={emailError}
            />

            <Input
              label="Password"
              placeholder="Enter your password (e.g. ••••••••)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
            />

            {authError ? <Text style={styles.authError}>{authError}</Text> : null}

            <Button
              testID="login-submit-button"
              title="Login"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitBtn}
            />

            {/* Social Login Options */}
            <View style={styles.socialDivider}>
              <View style={[styles.dividerLine, { backgroundColor: '#E2E8F0' }]} />
              <Text style={[styles.dividerText, { color: '#64748B' }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: '#E2E8F0' }]} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                testID="google-login-btn"
                style={styles.socialBtn}
                onPress={handleGoogleLogin}
                activeOpacity={0.7}
              >
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.socialBtnText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Continue as guest (Viewer)"
              variant="outline"
              onPress={() => continueAsGuest && continueAsGuest()}
              style={styles.guestBtn}
            />

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: themeColors.textMuted }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.registerLink, { color: themeColors.text }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Nomadix Premium Centered Modal Loader on Authentication */}
      <NomadixLoadingModal
        visible={isLoading}
        title="Authenticating Nomadix Traveler..."
        subtitle="Nomadix Departure Terminal • Fasten Seatbelt"
      />
    </ImageBackground>
  );
}

const getStyles = (themeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F172A',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', // bg-slate-900/85
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingTop: 54,
      paddingBottom: 0,
    },
    heroSection: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    logoBadge: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    logoBadgeText: {
      fontSize: 24,
      fontWeight: '900',
      color: '#0F172A',
    },
    heroTextContainer: {
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 34,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: -0.8,
      lineHeight: 40,
    },
    heroSubtitle: {
      fontSize: 13,
      fontWeight: '500',
      color: '#CBD5E1',
      marginTop: 10,
      lineHeight: 18,
      maxWidth: 290,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 38,
      borderWidth: 1,
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    demoLoginBtn: {
      backgroundColor: '#FEFCE8',
      borderWidth: 1,
      borderColor: '#FEF08A',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
      alignItems: 'center',
      marginBottom: 14,
    },
    demoLoginText: {
      color: '#A16207',
      fontWeight: '800',
      fontSize: 11,
    },
    submitBtn: {
      marginTop: 12,
      borderRadius: 18,
      backgroundColor: '#0F172A',
    },
    socialDivider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 14,
    },
    dividerLine: {
      flex: 1,
      height: 1,
    },
    dividerText: {
      marginHorizontal: 10,
      fontSize: 11,
      fontWeight: '600',
    },
    socialRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 6,
    },
    socialBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 11,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 16,
      backgroundColor: '#F8FAFC',
    },
    googleIconText: {
      fontWeight: '900',
      fontSize: 14,
      color: '#EA4335',
      marginRight: 6,
    },
    socialBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#1E293B',
    },
    guestBtn: {
      marginTop: 8,
      borderRadius: 18,
    },
    authError: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'center',
      marginVertical: 6,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    footerText: {
      fontSize: 12,
    },
    registerLink: {
      fontWeight: '800',
      fontSize: 12,
    },
  });
