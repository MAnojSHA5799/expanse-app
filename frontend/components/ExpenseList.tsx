import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Expense } from "../types";

type ExpenseProps = {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseList({ expense, onEdit, onDelete }: ExpenseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount.toString());

  const handleDelete = () => {
    console.log("Deleting expense:", expense.id); 
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(expense.id); 
          },
        },
      ]
    );
    
  };
  

  const handleUpdate = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Error", "Title and amount cannot be empty!");
      return;
    }

    onEdit({
      ...expense,
      title,
      amount: parseFloat(amount),
    });

    setIsEditing(false);
  };

  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>{expense.title}</Text>
            <Text style={styles.amount}>₹ {expense.amount.toFixed(2)}</Text>
            <Text style={styles.date}>{expense.date}</Text>
          </>
        )}
      </View>

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity onPress={handleUpdate} style={[styles.iconBtn, styles.saveBtn]}>
              <Ionicons name="checkmark-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={[styles.iconBtn, styles.cancelBtn]}>
              <Ionicons name="close-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.iconBtn, styles.editBtn]}>
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
  onPress={handleDelete}
  style={[styles.iconBtn, styles.deleteBtn]}
>
  <Ionicons name="trash-outline" size={22} color="#fff" />
</TouchableOpacity>

          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#333" },
  amount: { color: "green", marginTop: 4, fontWeight: "600" },
  date: { color: "#888", marginTop: 2, fontSize: 12 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: { backgroundColor: "green" },
  cancelBtn: { backgroundColor: "red" },
  editBtn: { backgroundColor: "#007bff" },
  deleteBtn: { backgroundColor: "#ff4d4d" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 6,
    borderRadius: 8,
    width: 140,
    backgroundColor: "#f9f9f9",
  },
});
