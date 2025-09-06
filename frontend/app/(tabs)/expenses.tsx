import { FlatList, StyleSheet, Text, View } from "react-native";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseList from "../../components/ExpenseList";
import { useExpenses } from "../../context/ExpenseContext";

export type Expense = {
  _id: string;   
  title: string;
  amount: number;
  date: string;
};


export default function ExpensesScreen() {
  const { expenses, addExpense, editExpense, deleteExpense } = useExpenses();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Expenses</Text>
      </View>
      <FlatList
  data={expenses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))}
  keyExtractor={(item) => item.id}  
  renderItem={({ item }) => (
    <ExpenseList
      expense={item}
      onEdit={(updated) => editExpense(updated)}
      onDelete={(id) => deleteExpense(id)}
    />
  )}
  ListHeaderComponent={
    <View style={styles.formContainer}>
      <ExpenseForm onAddExpense={addExpense} />
    </View>
  }
  contentContainerStyle={{ paddingBottom: 20 }}
  showsVerticalScrollIndicator={false}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  header: {
    paddingVertical: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
