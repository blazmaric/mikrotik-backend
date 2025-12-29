import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { trpc } from '@/utils/trpc';

export default function Index() {
  const hiMutation = trpc.example.hi.useMutation();

  const handleTest = () => {
    hiMutation.mutate({ name: 'MikroTik' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MikroTik Backend API</Text>
      <Text style={styles.subtitle}>Connected to: 193.77.60.244</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleTest}
        disabled={hiMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {hiMutation.isPending ? 'Testing...' : 'Test tRPC Connection'}
        </Text>
      </TouchableOpacity>

      {hiMutation.data && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Response:</Text>
          <Text style={styles.resultText}>
            {JSON.stringify(hiMutation.data, null, 2)}
          </Text>
        </View>
      )}

      {hiMutation.error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>
            Error: {hiMutation.error.message}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  result: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600' as const,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace' as const,
  },
  error: {
    backgroundColor: '#fee',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
});
