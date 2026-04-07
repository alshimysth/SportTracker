import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '@/hooks/use-login';
import type { ProblemDetail } from '@/types/auth';
import { isAxiosError } from 'axios';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ─── Brand tokens (mirrors tailwind.config.js) ────────────────────────────────
const BRAND_BLUE = '#1C3F60';
const BRAND_ORANGE = '#FF6B4A';
const DARK_BG = '#0B111A';
const DARK_SURFACE2 = '#2A3A54';
const DARK_BORDER = '#334060';
const DARK_TEXT = '#F0F6FF';
const DARK_TEXT_MUTED = '#8AABB8';
const DARK_CYAN = '#38BDF8';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin();

  function handleSubmit() {
    setFieldError(null);
    login(
      { email, password },
      {
        onSuccess: () => router.replace('/(tabs)/' as any),
        onError: (error) => {
          if (isAxiosError(error) && error.response) {
            const problem = error.response.data as ProblemDetail;
            setFieldError(problem.detail ?? problem.title);
          } else {
            setFieldError('Une erreur inattendue est survenue. Veuillez réessayer.');
          }
        },
      },
    );
  }

  // ─── Icon colours ──────────────────────────────────────────────────────────
  const iconColor = isDark ? DARK_TEXT_MUTED : '#9CA3AF';
  const inputBg = isDark ? DARK_SURFACE2 : '#FFFFFF';
  const inputBorder = isDark ? DARK_BORDER : '#E5E7EB';
  const inputText = isDark ? DARK_TEXT : '#111827';
  const inputPlaceholder = isDark ? '#506070' : '#D1D5DB';
  const labelColor = isDark ? DARK_TEXT_MUTED : '#6B7280';
  const dividerColor = isDark ? DARK_BORDER : '#F3F4F6';
  const dividerTextColor = isDark ? '#506070' : '#9CA3AF';
  const socialBtnBg = isDark ? DARK_SURFACE2 : '#FFFFFF';
  const socialBtnBorder = isDark ? DARK_BORDER : '#E5E7EB';
  const socialBtnText = isDark ? DARK_TEXT : '#374151';
  const footerTextColor = isDark ? '#506070' : '#6B7280';
  const ctaTextColor = isDark ? DARK_CYAN : '#FFFFFF';

  // CTA button styles
  const ctaStyle = isDark
    ? {
        backgroundColor: '#091828',
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.38)',
        shadowColor: DARK_CYAN,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }
    : {
        backgroundColor: BRAND_BLUE,
        shadowColor: BRAND_BLUE,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

  // Hero header styles
  const heroBg = isDark ? '#0D1E32' : BRAND_BLUE;
  const heroIconBg = isDark ? 'rgba(56,189,248,0.09)' : 'rgba(255,255,255,0.2)';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: isDark ? DARK_BG : '#FFFFFF' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ────────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: heroBg,
            paddingTop: 72,
            paddingBottom: 40,
            paddingHorizontal: 32,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            alignItems: 'center',
          }}
        >
          {/* App icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: heroIconBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Ionicons name="locate" size={32} color={isDark ? DARK_CYAN : '#FFFFFF'} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: isDark ? DARK_TEXT : '#FFFFFF',
              letterSpacing: -0.5,
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            SportTracker
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: isDark ? '#506070' : 'rgba(255,255,255,0.6)',
              marginTop: 4,
              fontFamily: 'Inter_400Regular',
            }}
          >
            Ton suivi sportif multidiscipline
          </Text>
        </View>

        {/* ── Form ───────────────────────────────────────────────────────── */}
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 32, paddingBottom: 24, gap: 16 }}>

          {/* Email */}
          <View>
            <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
              Email
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: inputBg,
                gap: 12,
              }}
            >
              <Ionicons name="mail-outline" size={18} color={iconColor} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
                placeholder="alex@example.com"
                placeholderTextColor={inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text style={{ fontSize: 12, fontWeight: '500', color: labelColor, marginBottom: 6, fontFamily: 'Inter_500Medium' }}>
              Mot de passe
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: inputBorder,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: inputBg,
                gap: 12,
              }}
            >
              <Ionicons name="lock-closed-outline" size={18} color={iconColor} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: inputText, fontFamily: 'Inter_400Regular' }}
                placeholder="••••••••"
                placeholderTextColor={inputPlaceholder}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
                accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={iconColor}
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot password */}
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: BRAND_ORANGE, fontFamily: 'Inter_500Medium' }}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {/* Error */}
          {fieldError && (
            <Text style={{ fontSize: 13, color: '#EF4444', fontFamily: 'Inter_400Regular' }}>
              {fieldError}
            </Text>
          )}

          {/* CTA — min 64px touch target per UX-DR10 */}
          <Pressable
            onPress={handleSubmit}
            disabled={isPending}
            style={[
              {
                minHeight: 64,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginTop: 8,
                opacity: isPending ? 0.7 : 1,
              },
              ctaStyle,
            ]}
          >
            {isPending ? (
              <ActivityIndicator color={ctaTextColor} />
            ) : (
              <Text style={{ fontSize: 15, fontWeight: '600', color: ctaTextColor, fontFamily: 'Inter_600SemiBold' }}>
                Se connecter
              </Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: dividerColor }} />
            <Text style={{ fontSize: 12, color: dividerTextColor, fontFamily: 'Inter_400Regular' }}>
              ou continuer avec
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: dividerColor }} />
          </View>

          {/* Social buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: socialBtnBorder,
                borderRadius: 12,
                paddingVertical: 14,
                backgroundColor: socialBtnBg,
                gap: 8,
                minHeight: 48,
              }}
            >
              {/* Google G icon approximation */}
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', lineHeight: 12 }}>G</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: socialBtnText, fontFamily: 'Inter_500Medium' }}>
                Google
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: socialBtnBorder,
                borderRadius: 12,
                paddingVertical: 14,
                backgroundColor: socialBtnBg,
                gap: 8,
                minHeight: 48,
              }}
            >
              <Ionicons name="logo-apple" size={18} color={isDark ? DARK_TEXT : '#111827'} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: socialBtnText, fontFamily: 'Inter_500Medium' }}>
                Apple
              </Text>
            </Pressable>
          </View>

          {/* Navigate to register */}
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            style={{ alignItems: 'center', minHeight: 48, justifyContent: 'center', marginTop: 8 }}
          >
            <Text style={{ fontSize: 14, color: footerTextColor, fontFamily: 'Inter_400Regular' }}>
              Pas de compte ? 
              <Text style={{ fontWeight: '500', color: BRAND_ORANGE, fontFamily: 'Inter_500Medium' }}>
                S&apos;inscrire
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
