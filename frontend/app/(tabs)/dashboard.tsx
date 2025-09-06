import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { useExpenses } from "../../context/ExpenseContext";

export default function DashboardScreen() {
  const { expenses } = useExpenses();
  const [filter, setFilter] = useState<"daily" | "weekly">("daily");

  // Total Expenses
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );
  const totalCount = expenses.length;

  // Chart Data
  const chartData = useMemo(() => {
    if (expenses.length === 0) return { labels: [], datasets: [{ data: [] }] };

    if (filter === "daily") {
      const grouped: Record<string, number> = {};
      expenses.forEach((exp) => {
        grouped[exp.date] = (grouped[exp.date] || 0) + exp.amount;
      });
      const labels = Object.keys(grouped).slice(-7);
      const data = Object.values(grouped).slice(-7);
      return { labels, datasets: [{ data }] };
    } else {
      const grouped: Record<string, number> = {};
      expenses.forEach((exp) => {
        const date = new Date(exp.date);
        const week = `W${getWeekNumber(date)}`;
        grouped[week] = (grouped[week] || 0) + exp.amount;
      });
      return {
        labels: Object.keys(grouped),
        datasets: [{ data: Object.values(grouped) }],
      };
    }
  }, [expenses, filter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Expenses Dashboard</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: "#ff6b6b" }]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryValue, { color: "#fff" }]}>
            ₹ {totalExpenses}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#1dd1a1" }]}>
          <Text style={styles.summaryLabel}>Total Entries</Text>
          <Text style={[styles.summaryValue, { color: "#fff" }]}>
            {totalCount}
          </Text>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterCard}>
        {["daily", "weekly"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeBtn]}
            onPress={() => setFilter(f as "daily" | "weekly")}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && { color: "#fff", fontWeight: "bold" },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Line Chart */}
      {expenses.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Trend</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisLabel="₹"
            chartConfig={{
              backgroundColor: "#6a11cb",
              backgroundGradientFrom: "#6a11cb",
              backgroundGradientTo: "#2575fc",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#fff" },
              propsForBackgroundLines: { strokeDasharray: "" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
      )}

      {/* Bar Chart */}
      {expenses.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Overview</Text>
         <BarChart
  data={chartData}
  width={Dimensions.get("window").width - 40}
  height={200}
  yAxisLabel="₹"
  yAxisSuffix="" 
  chartConfig={{
    backgroundColor: "#ff512f",
    backgroundGradientFrom: "#dd2476",
    backgroundGradientTo: "#ff512f",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.6,
  }}
  style={{ borderRadius: 16 }}
  fromZero
/>

        </View>
      )}

      {/* Expense List */}
      {expenses.length === 0 ? (
        <Text style={styles.noData}>No expenses yet. Start adding some!</Text>
      ) : (
        <FlatList
          data={expenses.sort(
            (a, b) => Date.parse(b.date) - Date.parse(a.date)
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
           <View style={[styles.item, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
  <View style={{ flexDirection: "column" }}>
    <Text style={styles.text}>{item.title}</Text>
    <Text style={styles.date}>{item.date}</Text>
  </View>

  <Text style={styles.amount}>₹ {item.amount}</Text>
</View>


          )}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ScrollView>
  );
}

//  get week number
function getWeekNumber(date: Date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f7" },
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryLabel: { fontSize: 14, color: "#fff", marginBottom: 6 },
  summaryValue: { fontSize: 18, fontWeight: "bold" },
  filterCard: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  activeBtn: { backgroundColor: "#0072ff" },
  filterText: { fontSize: 14, color: "#333" },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 5,
    backgroundColor: "#faf5f5ff",
    borderRadius: 16,
    elevation: 3,
  },
  chartTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#007bff" },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  amount: { fontSize: 16, fontWeight: "bold", color: "green", marginBottom: 2 },
  date: { fontSize: 12, color: "gray" },
  noData: { textAlign: "center", marginTop: 20, color: "#777" },
});
