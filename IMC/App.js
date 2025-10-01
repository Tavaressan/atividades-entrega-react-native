import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_tasks_v1';

export default function ToDoApp() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setTasks(JSON.parse(json));
    } catch (e) {
      console.warn('Error upon loading tasks', e);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Error upon loading tasks', e);
    }
  };

  const addTask = () => {
    const trimmed = text.trim();
    if (!trimmed) return Alert.alert('Attention', 'Write a task');

    const newTask = {
      id: Date.now().toString(),
      title: trimmed,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setText('');
    Keyboard.dismiss();
  };

  const toggleDone = (id) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

const removeTask = async (id) => {
  try {
    console.log('Removing task id:', id);
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log('Task removed and saved');
  } catch (e) {
    console.warn('Error upon loading tasks:', e);
  }
};

  const clearCompleted = () => {
    Alert.alert('Clear', 'Remove all finished tasks?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => setTasks(prev => prev.filter(t => !t.done)) },
    ]);
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const renderItem = ({ item }) => (
  <View style={styles.taskRow}>
    <Pressable
      onPress={() => toggleDone(item.id)}
      style={({ pressed }) => [
        styles.checkbox,
        item.done && styles.checkboxDone,
        pressed && { opacity: 0.7 },
      ]}
    >
      {item.done ? <Text style={styles.checkMark}>✓</Text> : null}
    </Pressable>

    <View style={styles.taskTextWrap}>
      <Text style={[styles.taskTitle, item.done && styles.taskDone]} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.taskMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>

    <TouchableOpacity
      onPress={() => removeTask(item.id)}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.deleteBtn}
    >
      <Text style={styles.deleteText}>Excluir</Text>
    </TouchableOpacity>
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add task..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />

        <Pressable onPress={addTask} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}>
          <Text style={styles.addBtnText}>Adicionar</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Pressable onPress={() => setFilter('all')} style={[styles.filterBtn, filter === 'all' && styles.filterActive]}>
          <Text style={styles.filterText}>Todas</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('active')} style={[styles.filterBtn, filter === 'active' && styles.filterActive]}>
          <Text style={styles.filterText}>Ativas</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('done')} style={[styles.filterBtn, filter === 'done' && styles.filterActive]}>
          <Text style={styles.filterText}>Concluídas</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Text style={styles.emptyText}>Nenhuma tarefa</Text></View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF3E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#829CBC',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#4A4A4A',
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  addBtn: {
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#829CBC',
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0EAD6', 
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: '#B4CDE6',
  },
  filterText: {
    color: '#5E6E80', 
    fontWeight: '600',
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0EAD6',
  },
  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#B2D8B2',
    borderColor: '#B2D8B2',
  },
  checkMark: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskTextWrap: {
    flex: 1,
  },
  taskTitle: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: '600',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#B0B0B0', 
  },
  taskMeta: {
    color: '#A9A9A9',
    fontSize: 11,
    marginTop: 4,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#E49393', // Pastel red
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  counter: {
    color: '#A9A9A9',
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearText: {
    color: '#E49393',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#A9A9A9',
  },
  
});