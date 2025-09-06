import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { Expense } from "../types";

type ExpenseFormProps = {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
};

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!title.trim() || !amount.trim()) {
      alert("Please enter a title and amount!");
      return;
    }

    onAddExpense({
      title,
      amount: Number(amount),
      date: date.toLocaleDateString(),
    });

    setTitle("");
    setAmount("");
    setDate(new Date());
  };

  const showDatePicker = () => setShowPicker(true);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios"); 
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f4f7" }}>
      {/* Header with Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Expense Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Expense Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Date Picker */}
        <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
          <Text style={{ color: "#333" }}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4facfe",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    margin: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
