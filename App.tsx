import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addContact = () => {
    if (name.trim() === '' || phone.trim() === '') {
      Alert.alert('Error', 'Please fill in at least name and phone number');
      return;
    }

    if (editingId) {
      // Update existing contact
      setContacts(contacts.map(contact => 
        contact.id === editingId 
          ? { ...contact, name: name.trim(), phone: phone.trim(), email: email.trim() }
          : contact
      ));
      setEditingId(null);
      Alert.alert('Success', 'Contact updated successfully!');
    } else {
      // Add new contact
      const newContact = {
        id: Date.now().toString(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };
      setContacts([...contacts, newContact]);
      Alert.alert('Success', 'Contact added successfully!');
    }
    
    // Clear input fields
    setName('');
    setPhone('');
    setEmail('');
  };

  const editContact = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
    setEditingId(contact.id);
  };

  const cancelEdit = () => {
    setName('');
    setPhone('');
    setEmail('');
    setEditingId(null);
  };

  const deleteContact = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(contact => contact.id !== id));
          }
        },
      ]
    );
  };

  const renderContact = ({ item }) => (
    <LinearGradient
      colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
      style={styles.contactItem}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>📞 {item.phone}</Text>
        {item.email ? <Text style={styles.contactEmail}>✉️ {item.email}</Text> : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editContact(item)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteContact(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        <Text style={styles.title}>📱 My Contacts</Text>
      
        {/* Add Contact Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingId ? '✏️ Edit Contact' : 'Create New Contact'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter name *"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter phone number *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter email (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          
          <View style={styles.formButtonContainer}>
            <TouchableOpacity 
              style={[styles.addButton, editingId ? styles.updateButton : null]} 
              onPress={addContact}
            >
              <Text style={styles.addButtonText}>
                {editingId ? '💾 Update Contact' : '➕ Add Contact'}
              </Text>
            </TouchableOpacity>
            
            {editingId && (
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>❌ Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contacts List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            👥 Saved Contacts ({contacts.length})
          </Text>
          
          {contacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📝 No contacts yet</Text>
              <Text style={styles.emptySubText}>Add your first contact above!</Text>
            </View>
          ) : (
            <FlatList
              data={contacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 25,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#32cd32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginRight: 5,
  },
  updateButton: {
    backgroundColor: '#27ae60',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 13,
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  contactEmail: {
    fontSize: 14,
    color: '#95a5a6',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#00bfff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 18,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
});

export default App;
