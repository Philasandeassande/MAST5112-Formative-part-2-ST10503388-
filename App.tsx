import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
};

type Errors = {
  name?: string;
  description?: string;
  course?: string;
  price?: string;
};

const COURSES = ['Starter', 'Main', 'Dessert'];

export default function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [items, setItems] = useState<MenuItem[]>([]);
  const [success, setSuccess] = useState('');

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Dish name is required.';
    if (!description.trim()) e.description = 'Description is required.';
    if (!course) e.course = 'Please select a course.';
    if (!price.trim()) {
      e.price = 'Price is required.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      e.price = 'Enter a valid price greater than 0.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    setSuccess('');
    if (!validate()) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      course,
      price: Number(price),
    };

    setItems((prev) => [...prev, newItem]);
    setName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
    setSuccess(`"${newItem.name}" was added to the menu!`);
    Alert.alert('Success', `"${newItem.name}" has been added.`);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.cardCourse}>{item.course}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
  );

  const ListHeader = (
    <View>
      <Text style={styles.title}>Chef's Menu Manager</Text>
      <Text style={styles.subtitle}>Add dishes to your menu</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Dish Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="e.g. Grilled Salmon"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline, errors.description && styles.inputError]}
          placeholder="Describe the dish"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {errors.description && <Text style={styles.error}>{errors.description}</Text>}

        <Text style={styles.label}>Course</Text>
        <View style={styles.chipRow}>
          {COURSES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, course === c && styles.chipActive]}
              onPress={() => setCourse(c)}
            >
              <Text style={[styles.chipText, course === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.course && <Text style={styles.error}>{errors.course}</Text>}

        <Text style={styles.label}>Price (R)</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="e.g. 85.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        {errors.price && <Text style={styles.error}>{errors.price}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add Menu Item</Text>
        </TouchableOpacity>

        {success !== '' && <Text style={styles.success}>{success}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Menu Items ({items.length})</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No menu items have been added yet. Use the form above to add your first dish.
            </Text>
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  listContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7A2E0E', textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#6B6B6B', textAlign: 'center', marginBottom: 20 },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  inputError: { borderColor: '#C62828' },
  error: { color: '#C62828', fontSize: 13, marginTop: 4 },
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FAFAFA',
  },
  chipActive: { backgroundColor: '#7A2E0E', borderColor: '#7A2E0E' },
  chipText: { color: '#333', fontSize: 15 },
  chipTextActive: { color: '#FFF', fontWeight: '600' },
  button: {
    backgroundColor: '#7A2E0E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  success: { color: '#2E7D32', textAlign: 'center', marginTop: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#7A2E0E', marginTop: 28, marginBottom: 10 },
  empty: { textAlign: 'center', color: '#6B6B6B', fontSize: 15, marginTop: 10, lineHeight: 22 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#7A2E0E',
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  cardPrice: { fontSize: 16, fontWeight: '600', color: '#2E7D32' },
  cardCourse: { fontSize: 13, color: '#7A2E0E', fontWeight: '600', marginTop: 2, marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#555' },
});

