import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';
import { useDeleteAccount } from '@/hooks/use-delete-account';
import { useAuthStore } from '@/store/use-auth-store';
import type { ProblemDetail } from '@/types/auth';
import { isAxiosError } from 'axios';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ─── JS-only colour values (passed to props that don't accept className) ───
  const bg = isDark ? colors.darkBg : '#F8F9FA';
  const heroBg = isDark ? colors.heroDark : colors.brandBlue;
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const inputBg = isDark ? colors.darkSurface : '#FFFFFF';
  const inputBorder = isDark ? colors.darkBorder : '#E5E7EB';
  const inputText = isDark ? colors.darkText : '#111827';
  const inputPlaceholder = isDark ? colors.placeholderDark : '#9CA3AF';
  const labelColor = isDark ? colors.darkTextMuted : '#6B7280';
  const mutedText = isDark ? colors.darkTextMuted : '#64748B';
  const ctaTextColor = isDark ? colors.primaryCyan : '#FFFFFF';

  const ctaStyle = isDark
    ? {
        backgroundColor: colors.ctaDark,
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.38)',
        shadowColor: colors.primaryCyan,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }
    : {
        backgroundColor: colors.brandOrange,
        shadowColor: colors.brandOrange,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

  function handleDeleteAccount() {
    Alert.alert(
      'Supprimer le compte',
      'Cette action supprimera définitivement ton compte et toutes tes données. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteAccount() },
      ],
    );
  }

  function startEditing() {
    setDisplayName(profile?.displayName ?? '');
    setBio(profile?.bio ?? '');
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  }

  function handleSave() {
    setError(null);
    setSuccess(false);

    const payload: Record<string, string> = {};
    if (displayName !== profile?.displayName) payload.displayName = displayName;
    if (bio !== (profile?.bio ?? '')) payload.bio = bio;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setSuccess(true);
        setIsEditing(false);
      },
      onError: (err) => {
        if (isAxiosError(err) && err.response) {
          const problem = err.response.data as ProblemDetail;
          setError(problem.detail ?? problem.title);
        } else {
          setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        }
      },
    });
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
        <ActivityIndicator size="large" color={isDark ? colors.primaryCyan : colors.brandOrange} />
      </View>
    );
  }

  const initial = (profile?.displayName ?? '?')[0].toUpperCase();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: bg }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: heroBg,
            paddingTop: 72,
            paddingBottom: 48,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.brandOrange,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.3)',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: '#FFFFFF',
                fontFamily: 'Inter_700Bold',
              }}
            >
              {initial}
            </Text>
          </View>

          {/* Name */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.3,
            }}
          >
            {profile?.displayName ?? '—'}
          </Text>

          {/* Email */}
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.65)',
              marginTop: 4,
              fontFamily: 'Inter_400Regular',
            }}
          >
            {profile?.email}
          </Text>

          {/* Bio */}
          {profile?.bio ? (
            <Text
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 10,
                textAlign: 'center',
                paddingHorizontal: 24,
                fontFamily: 'Inter_400Regular',
              }}
            >
              {profile.bio}
            </Text>
          ) : null}
        </View>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40, gap: 12 }}>

          {success && (
            <Text
              style={{
                fontSize: 13,
                color: colors.brandGreen,
                textAlign: 'center',
                marginBottom: 4,
                fontFamily: 'Inter_400Regular',
              }}
            >
              Profil mis à jour !
            </Text>
          )}

          {isEditing ? (
            <>
              {/* Display name field */}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: labelColor,
                    marginBottom: 6,
                    fontFamily: 'Inter_500Medium',
                  }}
                >
                  Nom affiché
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: inputBg,
                    fontSize: 14,
                    color: inputText,
                    fontFamily: 'Inter_400Regular',
                  }}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  placeholderTextColor={inputPlaceholder}
                />
              </View>

              {/* Bio field */}
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: labelColor,
                    marginBottom: 6,
                    fontFamily: 'Inter_500Medium',
                  }}
                >
                  Bio
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: inputBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: inputBg,
                    fontSize: 14,
                    color: inputText,
                    fontFamily: 'Inter_400Regular',
                    minHeight: 88,
                    textAlignVertical: 'top',
                  }}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  placeholder="Parle de tes sports..."
                  placeholderTextColor={inputPlaceholder}
                />
              </View>

              {error && (
                <Text style={{ fontSize: 13, color: '#EF4444', fontFamily: 'Inter_400Regular' }}>
                  {error}
                </Text>
              )}

              {/* Save — 64px touch target (UX-DR10) */}
              <Pressable
                onPress={handleSave}
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
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: ctaTextColor,
                      fontFamily: 'Inter_600SemiBold',
                    }}
                  >
                    Enregistrer
                  </Text>
                )}
              </Pressable>

              {/* Cancel */}
              <Pressable
                onPress={() => setIsEditing(false)}
                style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 14, color: mutedText, fontFamily: 'Inter_400Regular' }}>
                  Annuler
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Edit profile — 64px touch target (UX-DR10) */}
              <Pressable
                onPress={startEditing}
                style={[
                  {
                    minHeight: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    flexDirection: 'row',
                    gap: 8,
                  },
                  ctaStyle,
                ]}
              >
                <Ionicons name="pencil-outline" size={18} color={ctaTextColor} />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: ctaTextColor,
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  Modifier le profil
                </Text>
              </Pressable>

              {/* Sign out — secondary card button */}
              <Pressable
                onPress={clearAuth}
                style={{
                  minHeight: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  backgroundColor: cardBg,
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={isDark ? colors.darkTextMuted : '#6B7280'}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: isDark ? colors.darkTextMuted : '#374151',
                    fontFamily: 'Inter_500Medium',
                  }}
                >
                  Se déconnecter
                </Text>
              </Pressable>

              {/* Delete account — small destructive text link */}
              <Pressable
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  minHeight: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 8,
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#EF4444" size="small" />
                ) : (
                  <Text
                    style={{
                      fontSize: 13,
                      color: isDark ? colors.placeholderDark : '#9CA3AF',
                      fontFamily: 'Inter_400Regular',
                    }}
                  >
                    Supprimer le compte
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
