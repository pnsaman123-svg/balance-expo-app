import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text as RNText,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Path, Circle, G } from 'react-native-svg';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

// Helper to resolve exact Poppins font variant for crisp cross-platform rendering
const getPoppinsFont = (style) => {
  const flat = StyleSheet.flatten(style) || {};
  const weight = String(flat.fontWeight || '');
  if (weight === '900' || weight === 'black') return 'Poppins_900Black';
  if (weight === '800' || weight === 'extra-bold') return 'Poppins_800ExtraBold';
  if (weight === '700' || weight === 'bold') return 'Poppins_700Bold';
  if (weight === '600' || weight === 'semibold') return 'Poppins_600SemiBold';
  if (weight === '500' || weight === 'medium') return 'Poppins_500Medium';
  if (weight === '300' || weight === 'light') return 'Poppins_300Light';
  return 'Poppins_400Regular';
};

const Text = React.forwardRef((props, ref) => {
  const fontFam = getPoppinsFont(props.style);
  return (
    <RNText
      {...props}
      ref={ref}
      style={[
        { fontFamily: fontFam },
        props.style,
        Platform.OS === 'android' ? { fontWeight: undefined } : null,
      ]}
    />
  );
});

const TextInput = React.forwardRef((props, ref) => {
  const fontFam = getPoppinsFont(props.style);
  return (
    <RNTextInput
      {...props}
      ref={ref}
      style={[
        { fontFamily: fontFam },
        props.style,
        Platform.OS === 'android' ? { fontWeight: undefined } : null,
      ]}
    />
  );
});
import {
  Home,
  Receipt,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  ArrowLeft,
  MoreHorizontal,
  Bell,
  ChevronRight,
  ChevronDown,
  Delete,
  Check,
  House,
  ShoppingBasket,
  Zap,
  Car,
  Activity,
  UtensilsCrossed,
  ShoppingBag,
  Repeat,
  Gamepad2,
  ShieldCheck,
  TrendingUp,
  ArrowDownRight,
  Trash2,
  Edit2,
  ArrowDownLeft,
  X,
  ArrowUpRight,
  ArrowRightLeft,
  Calendar,
  RotateCcw,
  Tag,
  AlertCircle,
  Sparkles,
  AlertTriangle,
  SlidersHorizontal,
  Minus,
  Percent,
  ArrowRight,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const memoryStorage = {};
const safeStorage = {
  getItem: async (key) => {
    try {
      if (AsyncStorage && AsyncStorage.getItem) {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      return memoryStorage[key] || null;
    }
    return memoryStorage[key] || null;
  },
  setItem: async (key, val) => {
    memoryStorage[key] = val;
    try {
      if (AsyncStorage && AsyncStorage.setItem) {
        await AsyncStorage.setItem(key, val);
      }
    } catch (e) {}
  },
};

const STORAGE_KEY = '@balance_finance_mobile_v5_zero_start';

const DEFAULT_CATEGORIES = [
  {
    id: 'needs',
    name: 'Needs',
    targetPercent: 50,
    budget: 0,
    subcategories: [
      { id: 'sub-rent', name: 'Rent', budget: 0, icon: 'House' },
      { id: 'sub-groceries', name: 'Groceries', budget: 0, icon: 'ShoppingBasket' },
      { id: 'sub-utilities', name: 'Utilities', budget: 0, icon: 'Zap' },
      { id: 'sub-transport', name: 'Transportation', budget: 0, icon: 'Car' },
      { id: 'sub-medical', name: 'Medical', budget: 0, icon: 'Activity' },
    ],
  },
  {
    id: 'wants',
    name: 'Wants',
    targetPercent: 30,
    budget: 0,
    subcategories: [
      { id: 'sub-dining', name: 'Dining Out', budget: 0, icon: 'UtensilsCrossed' },
      { id: 'sub-shopping', name: 'Shopping', budget: 0, icon: 'ShoppingBag' },
      { id: 'sub-subscriptions', name: 'Subscriptions', budget: 0, icon: 'Repeat' },
      { id: 'sub-leisure', name: 'Leisure', budget: 0, icon: 'Gamepad2' },
    ],
  },
  {
    id: 'savings',
    name: 'Savings',
    targetPercent: 20,
    budget: 0,
    subcategories: [
      { id: 'sub-emergency', name: 'Emergency Fund', budget: 0, icon: 'ShieldCheck' },
      { id: 'sub-investments', name: 'Investments', budget: 0, icon: 'TrendingUp' },
      { id: 'sub-debt', name: 'Debt Repayment', budget: 0, icon: 'ArrowDownRight' },
    ],
  },
];

const INITIAL_DATA = {
  isOnboarded: false,
  userName: 'User',
  currency: '₹',
  selectedMonthId: '2026-09',
  months: {
    '2026-09': {
      monthId: '2026-09',
      monthName: 'September 2026',
      incomeSources: [],
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      transactions: [],
    },
  },
  historicalMonthlyData: [],
};

function RenderCategoryIcon({ iconName, size = 16, color = '#FFFFFF', bgColor = '#1C1C1C' }) {
  const iconMap = {
    House,
    ShoppingBasket,
    Zap,
    Car,
    Activity,
    UtensilsCrossed,
    ShoppingBag,
    Repeat,
    Gamepad2,
    ShieldCheck,
    TrendingUp,
    ArrowDownRight,
  };
  const IconComp = iconMap[iconName] || ShoppingBag;

  return (
    <View style={[styles.iconContainer, { width: size + 16, height: size + 16, backgroundColor: bgColor }]}>
      <IconComp size={size} color={color} strokeWidth={2} />
    </View>
  );
}

function OnboardingRatioSliderTrack({ label, percent, amount, color, onPercentChange, formatCurr }) {
  const [trackWidth, setTrackWidth] = useState(0);

  const handleTouch = (evt) => {
    if (trackWidth <= 0) return;
    const x = evt.nativeEvent.locationX;
    const rawPct = (x / trackWidth) * 100;
    const snapped = Math.max(0, Math.min(100, Math.round(rawPct / 5) * 5));
    onPercentChange(snapped);
  };

  return (
    <View style={styles.ratioSliderCard}>
      <View style={styles.ratioSliderHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.ratioPillarDot, { backgroundColor: color }]} />
          <Text style={styles.ratioSliderTitle}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={styles.ratioSliderAmount}>{formatCurr(amount)}</Text>
          <Text style={styles.ratioSliderPercent}>{percent}%</Text>
        </View>
      </View>

      {/* Horizontal Interactive Slider Bar */}
      <View
        style={styles.ratioSliderTrackContainer}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        <View style={styles.ratioSliderTrackBg}>
          <View style={[styles.ratioSliderTrackFill, { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }]} />
        </View>
        <View
          style={[
            styles.ratioSliderThumb,
            {
              left: `${Math.max(0, Math.min(92, percent - 4))}%`,
              borderColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const homeScrollRef = useRef(null);
  const [data, setData] = useState(INITIAL_DATA);
  const [currentTab, setCurrentTab] = useState('home');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedPillars, setExpandedPillars] = useState({ needs: false, wants: false, savings: false });
  const [selectedSubDetail, setSelectedSubDetail] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [targetCatIdForNewSub, setTargetCatIdForNewSub] = useState('needs');

  const togglePillar = (catId) => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPillars((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Home Screen Slide & Quick Entry State
  const [homeSlide, setHomeSlide] = useState(0); // 0: Quick Entry Keypad, 1: Monthly Budget & Recent Tx
  const [homeAmountStr, setHomeAmountStr] = useState('0');
  const [homeCatId, setHomeCatId] = useState('needs');

  const handleHomeKeypadPress = (val) => {
    if (val === 'backspace') {
      setHomeAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (!homeAmountStr.includes('.')) {
        setHomeAmountStr((prev) => prev + '.');
      }
      return;
    }
    setHomeAmountStr((prev) => {
      if (prev === '0') return val;
      if (prev.length >= 8) return prev;
      return prev + val;
    });
  };

  const handleQuickAddExpense = () => {
    const num = parseFloat(homeAmountStr || '0') || 0;
    if (num <= 0) return;

    setAmountStr(homeAmountStr);
    setEntryType('expense');
    setIsAddExpenseOpen(true);
  };

  // Keypad & Transaction Entry State (starts at 0)
  const [entryType, setEntryType] = useState('expense');
  const [amountStr, setAmountStr] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('needs');
  const [selectedSubId, setSelectedSubId] = useState('sub-groceries');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  // Adjust Allocation State
  const [isAdjustAllocationOpen, setIsAdjustAllocationOpen] = useState(false);
  const [customPercent, setCustomPercent] = useState({ needs: 50, wants: 30, savings: 20 });

  // Analytics State
  const [timeframe, setTimeframe] = useState('M');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  // New subcategory form state
  const [newSubName, setNewSubName] = useState('');
  const [newSubBudget, setNewSubBudget] = useState('');

  // Onboarding Setup State (clean zero state)
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [setupIncomeStr, setSetupIncomeStr] = useState('0');
  const [setupIncome, setSetupIncome] = useState([
    { id: '1', name: 'Monthly Salary', amount: '0' },
  ]);
  const [setupPercent, setSetupPercent] = useState({ needs: 50, wants: 30, savings: 20 });
  const [setupCategories, setSetupCategories] = useState({
    needs: [
      { id: 'sub-rent', name: 'Rent', budget: '10000', icon: 'House' },
      { id: 'sub-groceries', name: 'Groceries', budget: '6000', icon: 'ShoppingBasket' },
      { id: 'sub-utilities', name: 'Utilities', budget: '3000', icon: 'Zap' },
      { id: 'sub-transport', name: 'Transportation', budget: '4000', icon: 'Car' },
      { id: 'sub-medical', name: 'Medical', budget: '2000', icon: 'Activity' },
    ],
    wants: [
      { id: 'sub-dining', name: 'Dining Out', budget: '5000', icon: 'UtensilsCrossed' },
      { id: 'sub-shopping', name: 'Shopping', budget: '4000', icon: 'ShoppingBag' },
      { id: 'sub-subscriptions', name: 'Subscriptions', budget: '2000', icon: 'Repeat' },
      { id: 'sub-leisure', name: 'Leisure', budget: '4000', icon: 'Gamepad2' },
    ],
    savings: [
      { id: 'sub-emergency', name: 'Emergency Fund', budget: '4000', icon: 'ShieldCheck' },
      { id: 'sub-investments', name: 'Investments', budget: '4000', icon: 'TrendingUp' },
      { id: 'sub-debt', name: 'Debt Repayment', budget: '2000', icon: 'ArrowDownRight' },
    ],
  });
  const [activeSetupCat, setActiveSetupCat] = useState('needs');
  const [newSetupSubName, setNewSetupSubName] = useState('');
  const [newSetupSubBudget, setNewSetupSubBudget] = useState('');
  const [isAddingSetupSub, setIsAddingSetupSub] = useState(false);

  // Splash Screen Animated Values
  const [animWords] = useState(new Animated.Value(0));
  const [animGrad] = useState(new Animated.Value(0));
  const [animContent] = useState(new Animated.Value(0));
  const [animButtons] = useState(new Animated.Value(0));

  useEffect(() => {
    if (onboardingStep === 1) {
      animWords.setValue(0);
      animGrad.setValue(0);
      animContent.setValue(0);
      animButtons.setValue(0);

      Animated.sequence([
        Animated.timing(animWords, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animGrad, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(animContent, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(animButtons, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [onboardingStep]);

  // Load persistence
  useEffect(() => {
    (async () => {
      try {
        const saved = await safeStorage.getItem(STORAGE_KEY);
        if (saved) setData(JSON.parse(saved));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const saveData = async (newData) => {
    setData(newData);
    try {
      await safeStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.log(e);
    }
  };

  const toggleExpand = (catId) => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  const currentMonthData = useMemo(() => {
    const mId = data?.selectedMonthId || '2026-09';
    return (
      data?.months?.[mId] ||
      data?.months?.['2026-09'] || {
        monthId: '2026-09',
        monthName: 'September 2026',
        incomeSources: [],
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        transactions: [],
      }
    );
  }, [data]);

  // Financial Calculations
  const calculations = useMemo(() => {
    const incomeSources = currentMonthData?.incomeSources || [];
    const totalIncome = incomeSources.reduce((sum, s) => sum + (Number(s?.amount) || 0), 0);
    const categories = currentMonthData?.categories || DEFAULT_CATEGORIES;
    const transactions = currentMonthData?.transactions || [];

    const subSpent = {};
    transactions.forEach((tx) => {
      if (tx?.type === 'expense') {
        const subId = tx?.subcategoryId || 'general';
        subSpent[subId] = (subSpent[subId] || 0) + (Number(tx?.amount) || 0);
      }
    });

    const categoryStats = categories.map((cat) => {
      const isSavings = cat?.id === 'savings';
      const subcategoriesWithSpent = (cat?.subcategories || []).map((sub) => {
        const spent = subSpent[sub?.id] || 0;
        const budget = Number(sub?.budget) || 0;
        const remaining = Math.max(0, budget - spent);
        const isOverBudget = !isSavings && budget > 0 && spent > budget;
        const overAmount = isOverBudget ? spent - budget : 0;
        const actualPercentSpent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
        const percentSpent = Math.min(100, actualPercentSpent);
        const isTargetReached = isSavings && spent >= budget;

        return {
          ...sub,
          spent,
          remaining,
          isOverBudget,
          overAmount,
          actualPercentSpent,
          percentSpent,
          isTargetReached,
        };
      });

      const totalCatSpent = subcategoriesWithSpent.reduce((sum, s) => sum + s.spent, 0);
      const catBudget = Number(cat?.budget) || 0;
      const isCatOverBudget = !isSavings && catBudget > 0 && totalCatSpent > catBudget;
      const catOverAmount = isCatOverBudget ? totalCatSpent - catBudget : 0;
      const subcategoriesAllocated = subcategoriesWithSpent.reduce((sum, s) => sum + (Number(s?.budget) || 0), 0);
      const catUnallocated = Math.max(0, catBudget - subcategoriesAllocated);
      const catRemaining = Math.max(0, catBudget - totalCatSpent);
      const catActualPercentSpent = catBudget > 0 ? Math.round((totalCatSpent / catBudget) * 100) : 0;
      const percentSpent = Math.min(100, catActualPercentSpent);
      const percentRemaining = Math.max(0, 100 - percentSpent);

      return {
        ...cat,
        spent: totalCatSpent,
        remaining: catRemaining,
        isOverBudget: isCatOverBudget,
        overAmount: catOverAmount,
        subcategoriesAllocated,
        unallocated: catUnallocated,
        actualPercentSpent: catActualPercentSpent,
        percentSpent,
        percentRemaining,
        subcategories: subcategoriesWithSpent,
      };
    });

    const totalAllocated = categoryStats.reduce((sum, c) => sum + (Number(c?.budget) || 0), 0);
    const totalSpent = categoryStats.reduce((sum, c) => sum + c.spent, 0);
    const totalBalance = totalIncome - totalSpent;
    const isTotalOverBudget = totalAllocated > 0 && totalSpent > totalAllocated;
    const totalOverAmount = isTotalOverBudget ? totalSpent - totalAllocated : 0;
    const percentSpent = totalAllocated > 0 ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100)) : 0;

    const overBudgetSubcategories = categoryStats
      .flatMap((c) => c.subcategories.map((s) => ({ ...s, parentCatId: c.id, parentCatName: c.name })))
      .filter((s) => s.isOverBudget);

    const needs = categoryStats.find((c) => c?.id === 'needs') || { id: 'needs', name: 'Needs', budget: 0, spent: 0, remaining: 0, subcategories: [] };
    const wants = categoryStats.find((c) => c?.id === 'wants') || { id: 'wants', name: 'Wants', budget: 0, spent: 0, remaining: 0, subcategories: [] };
    const savings = categoryStats.find((c) => c?.id === 'savings') || { id: 'savings', name: 'Savings', budget: 0, spent: 0, remaining: 0, subcategories: [] };

    return {
      totalIncome,
      totalAllocated,
      totalSpent,
      totalBalance,
      isTotalOverBudget,
      totalOverAmount,
      percentSpent,
      categoryStats,
      overBudgetSubcategories,
      needs,
      wants,
      savings,
      transactions,
    };
  }, [currentMonthData]);

  const formatCurr = (num) => {
    const val = Number(num) || 0;
    const curr = data?.currency || '₹';
    return `${curr}${val.toLocaleString('en-IN')}`;
  };

  // 3-Column Keypad input handler
  const handleKeypadPress = (val) => {
    if (val === 'backspace') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (!amountStr.includes('.')) setAmountStr((prev) => prev + '.');
      return;
    }
    setAmountStr((prev) => (prev === '0' ? val : prev.length < 8 ? prev + val : prev));
  };

  const handleAddExpense = () => {
    const num = parseFloat(amountStr);
    if (!num || num <= 0) return;

    const curCat = currentMonthData.categories.find((c) => c.id === selectedCatId);
    const curSub = curCat?.subcategories.find((s) => s.id === selectedSubId) || curCat?.subcategories[0];

    const newTx = {
      id: `tx-${Date.now()}`,
      title: expenseTitle.trim() || curSub?.name || 'Expense',
      amount: num,
      type: 'expense',
      categoryId: selectedCatId,
      subcategoryId: curSub?.id,
      subcategoryName: curSub?.name,
      date: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: curSub?.icon || 'ShoppingBag',
      notes: expenseNotes.trim(),
    };

    const updatedMonth = {
      ...currentMonthData,
      transactions: [newTx, ...currentMonthData.transactions],
    };

    saveData({
      ...data,
      months: {
        ...data.months,
        [data.selectedMonthId]: updatedMonth,
      },
    });

    setIsAddExpenseOpen(false);
    setHomeAmountStr('0');
    setAmountStr('0');
    setExpenseTitle('');
    setExpenseNotes('');
  };

  const handleDeleteTransaction = (id) => {
    const updatedMonth = {
      ...currentMonthData,
      transactions: currentMonthData.transactions.filter((t) => t.id !== id),
    };
    saveData({
      ...data,
      months: {
        ...data.months,
        [data.selectedMonthId]: updatedMonth,
      },
    });
  };

  const handleUpdateTransaction = (txId, newAmount, newTitle, newCatId, newSubId, newNotes) => {
    const curCat = currentMonthData.categories.find((c) => c.id === newCatId);
    const curSub = curCat?.subcategories.find((s) => s.id === newSubId);

    const updatedMonth = {
      ...currentMonthData,
      transactions: currentMonthData.transactions.map((t) =>
        t.id === txId
          ? {
              ...t,
              amount: parseFloat(newAmount) || t.amount,
              title: newTitle.trim() || t.title,
              categoryId: newCatId,
              subcategoryId: newSubId,
              subcategoryName: curSub?.name || t.subcategoryName,
              notes: newNotes,
            }
          : t
      ),
    };

    saveData({
      ...data,
      months: {
        ...data.months,
        [data.selectedMonthId]: updatedMonth,
      },
    });
    setEditingTransaction(null);
  };

  const handleOpenAdjustAllocation = () => {
    const cats = currentMonthData.categories || DEFAULT_CATEGORIES;
    const n = cats.find((c) => c.id === 'needs');
    const w = cats.find((c) => c.id === 'wants');
    const s = cats.find((c) => c.id === 'savings');

    const totalInc = calculations.totalIncome || 50000;
    const nPct = n?.targetPercent !== undefined ? n.targetPercent : Math.round(((n?.budget || 0) / totalInc) * 100);
    const wPct = w?.targetPercent !== undefined ? w.targetPercent : Math.round(((w?.budget || 0) / totalInc) * 100);
    const sPct = s?.targetPercent !== undefined ? s.targetPercent : Math.max(0, 100 - (nPct || 50) - (wPct || 30));

    setCustomPercent({
      needs: nPct || 50,
      wants: wPct || 30,
      savings: sPct || 20,
    });
    setIsAdjustAllocationOpen(true);
  };

  const handleStepPercent = (categoryKey, delta) => {
    setCustomPercent((prev) => {
      const currentVal = prev[categoryKey] || 0;
      const newVal = Math.max(0, Math.min(100, currentVal + delta));
      return { ...prev, [categoryKey]: newVal };
    });
  };

  const handleSelectPreset = (needs, wants, savings) => {
    setCustomPercent({ needs, wants, savings });
  };

  const handleSaveAllocationPercentages = () => {
    const totalInc = calculations.totalIncome || 50000;
    const newNeedsBudget = Math.round((totalInc * customPercent.needs) / 100);
    const newWantsBudget = Math.round((totalInc * customPercent.wants) / 100);
    const newSavingsBudget = Math.round((totalInc * customPercent.savings) / 100);

    const updatedCategories = currentMonthData.categories.map((cat) => {
      if (cat.id === 'needs') {
        const oldBudget = cat.budget || 1;
        const ratio = newNeedsBudget / oldBudget;
        return {
          ...cat,
          targetPercent: customPercent.needs,
          budget: newNeedsBudget,
          subcategories: cat.subcategories.map((s) => ({
            ...s,
            budget: Math.round(s.budget * ratio),
          })),
        };
      }
      if (cat.id === 'wants') {
        const oldBudget = cat.budget || 1;
        const ratio = newWantsBudget / oldBudget;
        return {
          ...cat,
          targetPercent: customPercent.wants,
          budget: newWantsBudget,
          subcategories: cat.subcategories.map((s) => ({
            ...s,
            budget: Math.round(s.budget * ratio),
          })),
        };
      }
      if (cat.id === 'savings') {
        const oldBudget = cat.budget || 1;
        const ratio = newSavingsBudget / oldBudget;
        return {
          ...cat,
          targetPercent: customPercent.savings,
          budget: newSavingsBudget,
          subcategories: cat.subcategories.map((s) => ({
            ...s,
            budget: Math.round(s.budget * ratio),
          })),
        };
      }
      return cat;
    });

    const updatedMonth = {
      ...currentMonthData,
      categories: updatedCategories,
    };

    saveData({
      ...data,
      months: {
        ...data.months,
        [data.selectedMonthId]: updatedMonth,
      },
    });

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAdjustAllocationOpen(false);
  };

  const handleAddSubcategory = () => {
    if (!newSubName.trim() || !newSubBudget) return;
    const b = parseFloat(newSubBudget) || 0;
    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      budget: b,
      icon: 'ShoppingBag',
    };

    const updatedCategories = currentMonthData.categories.map((c) => {
      if (c.id === targetCatIdForNewSub) {
        return {
          ...c,
          subcategories: [...c.subcategories, newSub],
        };
      }
      return c;
    });

    const updatedMonth = { ...currentMonthData, categories: updatedCategories };
    saveData({
      ...data,
      months: { ...data.months, [data.selectedMonthId]: updatedMonth },
    });

    setIsAddSubcategoryOpen(false);
    setNewSubName('');
    setNewSubBudget('');
  };

  const handleDeleteSubcategory = (catId, subId) => {
    const updatedCategories = currentMonthData.categories.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.filter((s) => s.id !== subId),
        };
      }
      return c;
    });

    const updatedMonth = { ...currentMonthData, categories: updatedCategories };
    saveData({
      ...data,
      months: { ...data.months, [data.selectedMonthId]: updatedMonth },
    });
    if (selectedSubDetail && selectedSubDetail.subId === subId) {
      setSelectedSubDetail(null);
    }
  };

  const handleAddSetupSubcategory = () => {
    if (!newSetupSubName.trim()) return;
    const totalSetupInc = parseFloat(setupIncomeStr || '0') || 0;
    const activePillarCap = Math.round((totalSetupInc * (setupPercent[activeSetupCat] || 0)) / 100);
    const currentSubs = setupCategories[activeSetupCat] || [];
    const currentSubTotal = currentSubs.reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);
    const remaining = Math.max(0, activePillarCap - currentSubTotal);

    const enteredNum = parseFloat(newSetupSubBudget) || 0;
    const finalBudget = Math.min(enteredNum, remaining);

    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSetupSubName.trim(),
      budget: String(finalBudget),
      icon: 'ShoppingBag',
    };
    setSetupCategories((prev) => ({
      ...prev,
      [activeSetupCat]: [...prev[activeSetupCat], newSub],
    }));
    setNewSetupSubName('');
    setNewSetupSubBudget('');
  };

  const handleDeleteSetupSubcategory = (catKey, subId) => {
    setSetupCategories((prev) => ({
      ...prev,
      [catKey]: prev[catKey].filter((s) => s.id !== subId),
    }));
  };

  const handleUpdateSetupSubName = (catKey, subId, name) => {
    setSetupCategories((prev) => ({
      ...prev,
      [catKey]: prev[catKey].map((s) => (s.id === subId ? { ...s, name } : s)),
    }));
  };

  const handleUpdateSetupSubBudget = (catKey, subId, budget) => {
    const totalSetupInc = parseFloat(setupIncomeStr || '0') || 0;
    const activePillarCap = Math.round((totalSetupInc * (setupPercent[catKey] || 0)) / 100);
    const currentSubs = setupCategories[catKey] || [];
    const otherSubsSum = currentSubs
      .filter((s) => s.id !== subId)
      .reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);
    const maxAllowed = Math.max(0, activePillarCap - otherSubsSum);

    let finalVal = budget;
    if (budget !== '' && !isNaN(budget)) {
      const num = parseFloat(budget) || 0;
      if (num > maxAllowed) {
        finalVal = String(maxAllowed);
      }
    }

    setSetupCategories((prev) => ({
      ...prev,
      [catKey]: prev[catKey].map((s) => (s.id === subId ? { ...s, budget: finalVal } : s)),
    }));
  };

  const handleSetupKeypadPress = (val) => {
    if (val === 'backspace') {
      setSetupIncomeStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (!setupIncomeStr.includes('.')) {
        setSetupIncomeStr((prev) => prev + '.');
      }
      return;
    }
    setSetupIncomeStr((prev) => {
      if (prev === '0') return val;
      if (prev.length >= 8) return prev;
      return prev + val;
    });
  };

  // ----------------------------------------------------
  // ONBOARDING SETUP FLOW
  // ----------------------------------------------------
  const renderOnboarding = () => {
    const totalSetupInc = parseFloat(setupIncomeStr || '0') || 0;
    const allocNeeds = Math.round((totalSetupInc * setupPercent.needs) / 100);
    const allocWants = Math.round((totalSetupInc * setupPercent.wants) / 100);
    const allocSavings = Math.round((totalSetupInc * setupPercent.savings) / 100);
    const totalAlloc = allocNeeds + allocWants + allocSavings;

    if (onboardingStep === 1) {
      return (
        <View style={styles.splashContainer}>
          {/* Upper / Middle Stacked Minimal Typography with Whitespace */}
          <Animated.View
            style={[
              styles.splashTypographyContainer,
              {
                paddingTop: insets.top + 48,
                opacity: animWords,
                transform: [
                  {
                    translateY: animWords.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.splashMutedWord}>Plan</Text>
            <Text style={styles.splashBoldWord}>SPEND</Text>
            <Text style={styles.splashMutedWord}>Save</Text>
          </Animated.View>

          {/* Soft Organic Monochrome Gradient Rising from the Bottom */}
          <Animated.View style={[styles.splashGradientWrapper, { opacity: animGrad }]} pointerEvents="none">
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
              <Defs>
                <SvgLinearGradient id="splashMonochromeGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                  <Stop offset="0.20" stopColor="#F5F5F5" stopOpacity="0.8" />
                  <Stop offset="0.45" stopColor="#D6D6D6" stopOpacity="0.95" />
                  <Stop offset="0.70" stopColor="#737373" stopOpacity="1" />
                  <Stop offset="1" stopColor="#141414" stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#splashMonochromeGrad)" />
            </Svg>
          </Animated.View>

          {/* Content Positioned Over the Lower Gradient Area */}
          <View style={[styles.splashLowerContent, { paddingBottom: Math.max(24, insets.bottom + 16) }]}>
            <Animated.View
              style={{
                opacity: animContent,
                transform: [
                  {
                    translateY: animContent.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              {/* Small Monochrome Icon Badge */}
              <View style={styles.splashIconBadge}>
                <Sparkles size={16} color="#FFFFFF" strokeWidth={2.4} />
              </View>

              {/* Large Short Headline */}
              <Text style={styles.splashHeadline}>Your money,{"\n"}in balance.</Text>

              {/* Small Supporting Description */}
              <Text style={styles.splashSubtext}>
                Plan your income, track your spending,{"\n"}and know exactly where your money goes.
              </Text>
            </Animated.View>

            {/* Two Large Rounded CTA Buttons */}
            <Animated.View
              style={[
                styles.splashButtonsContainer,
                {
                  opacity: animButtons,
                  transform: [
                    {
                      translateY: animButtons.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Primary: Get Started (Black background, White text) */}
              <TouchableOpacity
                style={styles.splashPrimaryBtn}
                onPress={() => {
                  setSetupIncomeStr('0');
                  setOnboardingStep(2);
                }}
                activeOpacity={0.88}
              >
                <Text style={styles.splashPrimaryBtnText}>Get Started</Text>
              </TouchableOpacity>

              {/* Secondary: I already have an account (Very light grey background, Black text) */}
              <TouchableOpacity
                style={styles.splashSecondaryBtn}
                onPress={() => {
                  saveData({
                    ...INITIAL_DATA,
                    isOnboarded: true,
                  });
                  setCurrentTab('home');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.splashSecondaryBtnText}>I already have an account</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      );
    }

    if (onboardingStep === 2) {
      return (
        <View style={[styles.onboardingContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 12, justifyContent: 'space-between', paddingHorizontal: 16 }]}>
          {/* Top Title Only */}
          <View style={{ paddingTop: 6 }}>
            <Text style={styles.onboardingStepTitle}>What is your monthly income?</Text>
          </View>

          {/* Large Hero Calculator Display */}
          <View style={styles.calcHeroDisplay}>
            <Text style={styles.calcHeroCurrency}>{data.currency}</Text>
            <Text style={styles.calcHeroAmount} numberOfLines={1}>
              {parseFloat(setupIncomeStr || '0').toLocaleString('en-IN')}
            </Text>
          </View>

          {/* Filled Bottom Calculator Keypad (4 Rows) */}
          <View style={styles.calcKeypadWrapperFilled}>
            {/* Row 1 */}
            <View style={styles.calcKeypadRow}>
              {['1', '2', '3'].map((k) => (
                <TouchableOpacity
                  key={k}
                  style={styles.calcKeypadBtnFilled}
                  onPress={() => handleSetupKeypadPress(k)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.calcKeypadTextFilled}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={styles.calcKeypadRow}>
              {['4', '5', '6'].map((k) => (
                <TouchableOpacity
                  key={k}
                  style={styles.calcKeypadBtnFilled}
                  onPress={() => handleSetupKeypadPress(k)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.calcKeypadTextFilled}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View style={styles.calcKeypadRow}>
              {['7', '8', '9'].map((k) => (
                <TouchableOpacity
                  key={k}
                  style={styles.calcKeypadBtnFilled}
                  onPress={() => handleSetupKeypadPress(k)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.calcKeypadTextFilled}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4: Backspace (left to zero) | 0 (center) | Checkmark Tick (right to zero) */}
            <View style={styles.calcKeypadRow}>
              {/* Left to zero: Backspace */}
              <TouchableOpacity
                style={styles.calcKeypadBtnFilled}
                onPress={() => handleSetupKeypadPress('backspace')}
                activeOpacity={0.7}
              >
                <Delete size={24} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>

              {/* Center: 0 */}
              <TouchableOpacity
                style={styles.calcKeypadBtnFilled}
                onPress={() => handleSetupKeypadPress('0')}
                activeOpacity={0.7}
              >
                <Text style={styles.calcKeypadTextFilled}>0</Text>
              </TouchableOpacity>

              {/* Right to zero: Tick Mark to proceed to next step */}
              <TouchableOpacity
                style={[
                  styles.calcKeypadBtnFilled,
                  totalSetupInc > 0 ? styles.calcKeypadBtnTickActive : styles.calcKeypadBtnTickDisabled,
                ]}
                onPress={() => {
                  if (totalSetupInc > 0) {
                    setSetupIncome([{ id: '1', name: 'Monthly Salary', amount: setupIncomeStr }]);
                    setOnboardingStep(3);
                  }
                }}
                disabled={totalSetupInc <= 0}
                activeOpacity={0.8}
              >
                <Check
                  size={26}
                  color={totalSetupInc > 0 ? '#090909' : '#555555'}
                  strokeWidth={3}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (onboardingStep === 3) {
      const totalPct = (setupPercent.needs || 0) + (setupPercent.wants || 0) + (setupPercent.savings || 0);
      const isBalanced = totalPct === 100;

      const autoFixPercentages = (needs, wants, savings) => {
        const n = Math.max(0, Math.min(100, Math.round(Number(needs) || 0)));
        const w = Math.max(0, Math.min(100, Math.round(Number(wants) || 0)));
        if (n >= 100) {
          return { needs: 80, wants: 10, savings: 10 };
        }
        if (n + w >= 100) {
          const adjW = Math.max(5, 100 - n - 5);
          const adjS = Math.max(0, 100 - n - adjW);
          return { needs: n, wants: adjW, savings: adjS };
        }
        return { needs: n, wants: w, savings: 100 - n - w };
      };

      return (
        <View style={[styles.onboardingContainer, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, justifyContent: 'space-between' }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Header Title Only (No Subtext) */}
            <View style={{ paddingTop: 6, marginBottom: 18 }}>
              <Text style={styles.onboardingStepTitle}>Where should your money go?</Text>
            </View>

            {/* Horizontal Segmented Ratio Visualizer Bar */}
            <View style={styles.ratioVisualizerContainer}>
              <View style={styles.ratioVisualizerBar}>
                <View style={[styles.ratioVisualizerSeg, { flex: Math.max(1, setupPercent.needs), backgroundColor: '#FFFFFF' }]} />
                <View style={[styles.ratioVisualizerSeg, { flex: Math.max(1, setupPercent.wants), backgroundColor: '#8E8E93' }]} />
                <View style={[styles.ratioVisualizerSeg, { flex: Math.max(1, setupPercent.savings), backgroundColor: '#48484A' }]} />
              </View>
              <View style={styles.ratioVisualizerLegend}>
                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioLegendDot, { backgroundColor: '#FFFFFF' }]} />
                  <Text style={styles.ratioLegendText}>Needs {setupPercent.needs}%</Text>
                </View>
                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioLegendDot, { backgroundColor: '#8E8E93' }]} />
                  <Text style={styles.ratioLegendText}>Wants {setupPercent.wants}%</Text>
                </View>
                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioLegendDot, { backgroundColor: '#48484A' }]} />
                  <Text style={styles.ratioLegendText}>Savings {setupPercent.savings}%</Text>
                </View>
              </View>
            </View>

            {/* Ratio Presets Below Top Bar */}
            <View style={styles.ratioPillsRow}>
              {[
                { ratio: '50/30/20', n: 50, w: 30, s: 20 },
                { ratio: '60/20/20', n: 60, w: 20, s: 20 },
                { ratio: '70/20/10', n: 70, w: 20, s: 10 },
                { ratio: '40/30/30', n: 40, w: 30, s: 30 },
              ].map((r) => {
                const isMatch =
                  setupPercent.needs === r.n &&
                  setupPercent.wants === r.w &&
                  setupPercent.savings === r.s;
                return (
                  <TouchableOpacity
                    key={r.ratio}
                    onPress={() => setSetupPercent({ needs: r.n, wants: r.w, savings: r.s })}
                    style={[styles.ratioPillChip, isMatch && styles.ratioPillChipActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.ratioPillText, isMatch && styles.ratioPillTextActive]}>
                      {r.ratio}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Horizontal Sliders for Each Pillar (No Subtext) */}
            <View style={{ gap: 12 }}>
              <OnboardingRatioSliderTrack
                label="Needs"
                percent={setupPercent.needs}
                amount={allocNeeds}
                color="#FFFFFF"
                formatCurr={formatCurr}
                onPercentChange={(val) => setSetupPercent((prev) => ({ ...prev, needs: val }))}
              />

              <OnboardingRatioSliderTrack
                label="Wants"
                percent={setupPercent.wants}
                amount={allocWants}
                color="#8E8E93"
                formatCurr={formatCurr}
                onPercentChange={(val) => setSetupPercent((prev) => ({ ...prev, wants: val }))}
              />

              <OnboardingRatioSliderTrack
                label="Savings"
                percent={setupPercent.savings}
                amount={allocSavings}
                color="#636366"
                formatCurr={formatCurr}
                onPercentChange={(val) => setSetupPercent((prev) => ({ ...prev, savings: val }))}
              />
            </View>

            {/* Single Centered CTA for Auto-Fix or Balance Status */}
            <View style={styles.centerAutoFixWrapper}>
              {!isBalanced ? (
                <TouchableOpacity
                  style={styles.centerAutoFixCta}
                  onPress={() => {
                    const fixed = autoFixPercentages(setupPercent.needs, setupPercent.wants, setupPercent.savings);
                    setSetupPercent(fixed);
                  }}
                  activeOpacity={0.85}
                >
                  <Sparkles size={17} color="#090909" strokeWidth={2.5} />
                  <Text style={styles.centerAutoFixText}>
                    Auto Fix to 100% ({totalPct > 100 ? `+${totalPct - 100}% over` : `${100 - totalPct}% left`})
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.centerBalancedIndicator}>
                  <Check size={16} color="#FFFFFF" strokeWidth={2.8} />
                  <Text style={styles.centerBalancedText}>✓ 100% Balanced ({formatCurr(totalSetupInc)})</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Navigation with Highlighted Continue CTA */}
          <View style={styles.onboardingNavRow}>
            <TouchableOpacity
              style={styles.onboardingBackCircleBtn}
              onPress={() => setOnboardingStep(2)}
              activeOpacity={0.75}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.onboardingContinueArrowBtn,
                !isBalanced && styles.onboardingContinueArrowBtnDisabled,
              ]}
              onPress={() => {
                let currentPct = setupPercent;
                if (!isBalanced) {
                  currentPct = autoFixPercentages(setupPercent.needs, setupPercent.wants, setupPercent.savings);
                  setSetupPercent(currentPct);
                }

                const effectiveNeeds = Math.round((totalSetupInc * currentPct.needs) / 100);
                const effectiveWants = Math.round((totalSetupInc * currentPct.wants) / 100);
                const effectiveSavings = Math.round((totalSetupInc * currentPct.savings) / 100);

                // Initialize default subcategory budgets proportional to the pillar allocations
                setSetupCategories({
                  needs: [
                    { id: 'sub-rent', name: 'Rent', budget: String(Math.round(effectiveNeeds * 0.4)), icon: 'House' },
                    { id: 'sub-groceries', name: 'Groceries', budget: String(Math.round(effectiveNeeds * 0.25)), icon: 'ShoppingBasket' },
                    { id: 'sub-utilities', name: 'Utilities', budget: String(Math.round(effectiveNeeds * 0.15)), icon: 'Zap' },
                    { id: 'sub-transport', name: 'Transportation', budget: String(Math.round(effectiveNeeds * 0.12)), icon: 'Car' },
                    { id: 'sub-medical', name: 'Medical', budget: String(Math.round(effectiveNeeds * 0.08)), icon: 'Activity' },
                  ],
                  wants: [
                    { id: 'sub-dining', name: 'Dining Out', budget: String(Math.round(effectiveWants * 0.35)), icon: 'UtensilsCrossed' },
                    { id: 'sub-shopping', name: 'Shopping', budget: String(Math.round(effectiveWants * 0.3)), icon: 'ShoppingBag' },
                    { id: 'sub-subscriptions', name: 'Subscriptions', budget: String(Math.round(effectiveWants * 0.15)), icon: 'Repeat' },
                    { id: 'sub-leisure', name: 'Leisure', budget: String(Math.round(effectiveWants * 0.2)), icon: 'Gamepad2' },
                  ],
                  savings: [
                    { id: 'sub-emergency', name: 'Emergency Fund', budget: String(Math.round(effectiveSavings * 0.4)), icon: 'ShieldCheck' },
                    { id: 'sub-investments', name: 'Investments', budget: String(Math.round(effectiveSavings * 0.4)), icon: 'TrendingUp' },
                    { id: 'sub-debt', name: 'Debt Repayment', budget: String(Math.round(effectiveSavings * 0.2)), icon: 'ArrowDownRight' },
                  ],
                });
                setOnboardingStep(4);
              }}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: isBalanced ? '#090909' : '#FFFFFF' }}>
                  Continue
                </Text>
                <ArrowRight size={18} color={isBalanced ? '#090909' : '#FFFFFF'} strokeWidth={3} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (onboardingStep === 4) {
      const activePillarBudget = activeSetupCat === 'needs' ? allocNeeds : activeSetupCat === 'wants' ? allocWants : allocSavings;
      const currentSubList = setupCategories[activeSetupCat] || [];
      const subTotal = currentSubList.reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);
      const pillarDiff = activePillarBudget - subTotal;

      return (
        <View style={[styles.onboardingContainer, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, justifyContent: 'space-between' }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Title Only (No step label or subtext) */}
            <View style={{ paddingTop: 6, marginBottom: 16 }}>
              <Text style={styles.onboardingStepTitle}>Customize Expense Categories</Text>
            </View>

            {/* Segmented Pillar Selector */}
            <View style={[styles.catTabContainer, { marginBottom: 12 }]}>
              {[
                { key: 'needs', label: 'Needs', amount: allocNeeds },
                { key: 'wants', label: 'Wants', amount: allocWants },
                { key: 'savings', label: 'Savings', amount: allocSavings },
              ].map((tab) => {
                const isActive = activeSetupCat === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveSetupCat(tab.key)}
                    style={[styles.catTabBtn, isActive && styles.catTabBtnActive]}
                  >
                    <Text style={[styles.catTabText, isActive && styles.catTabTextActive]}>
                      {tab.label}
                    </Text>
                    <Text style={[styles.catTabSubText, isActive && styles.catTabSubTextActive]}>
                      {formatCurr(tab.amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Active Pillar Allocation Budget Limit & Status Card */}
            <View style={styles.pillarAllocationSummaryCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.pillarSummaryLabel}>
                  {activeSetupCat.toUpperCase()} ALLOCATED
                </Text>
                <Text
                  style={[
                    styles.pillarSummaryRemaining,
                    pillarDiff === 0 && { color: '#FFFFFF' },
                    pillarDiff < 0 && { color: '#FF6B6B' },
                  ]}
                >
                  {pillarDiff === 0
                    ? '✓ 100% Allocated'
                    : pillarDiff > 0
                    ? `${formatCurr(pillarDiff)} available`
                    : `Exceeds by ${formatCurr(Math.abs(pillarDiff))}`}
                </Text>
              </View>
              <View style={styles.pillarProgressBarBg}>
                <View
                  style={[
                    styles.pillarProgressBarFill,
                    {
                      width: `${Math.min(100, Math.max(0, (subTotal / (activePillarBudget || 1)) * 100))}%`,
                      backgroundColor: pillarDiff < 0 ? '#FF6B6B' : '#FFFFFF',
                    },
                  ]}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 11, color: '#8A8A8A', fontWeight: '600' }}>
                  {formatCurr(subTotal)} allocated
                </Text>
                <Text style={{ fontSize: 11, color: '#8A8A8A', fontWeight: '600' }}>
                  Limit: {formatCurr(activePillarBudget)}
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              {currentSubList.map((sub) => (
                <View key={sub.id} style={styles.setupSubRow}>
                  <RenderCategoryIcon iconName={sub.icon || 'ShoppingBag'} size={16} color="#FFFFFF" bgColor="#222222" />
                  <TextInput
                    value={sub.name}
                    onChangeText={(text) => handleUpdateSetupSubName(activeSetupCat, sub.id, text)}
                    placeholder="Category Name"
                    placeholderTextColor="#666666"
                    style={styles.setupSubNameInput}
                  />
                  <View style={styles.setupSubAmountBox}>
                    <Text style={{ color: '#8A8A8A', fontSize: 12, fontWeight: 'bold' }}>{data.currency}</Text>
                    <TextInput
                      value={String(sub.budget)}
                      onChangeText={(val) => handleUpdateSetupSubBudget(activeSetupCat, sub.id, val)}
                      placeholder="0"
                      placeholderTextColor="#666666"
                      keyboardType="numeric"
                      style={styles.setupSubAmountInput}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteSetupSubcategory(activeSetupCat, sub.id)}
                    style={styles.setupSubTrashBtn}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#8A8A8A" />
                  </TouchableOpacity>
                </View>
              ))}

              {currentSubList.length === 0 && (
                <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#141414', borderRadius: 16 }}>
                  <Text style={{ color: '#8A8A8A', fontSize: 13 }}>No categories yet. Add one below!</Text>
                </View>
              )}
            </View>

            {/* Centered Add Category CTA & Expandable Form */}
            {!isAddingSetupSub ? (
              <View style={styles.centerAddCategoryWrapper}>
                <TouchableOpacity
                  style={[
                    styles.centerAddCategoryBtn,
                    pillarDiff <= 0 && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    if (pillarDiff <= 0) return;
                    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
                      UIManager.setLayoutAnimationEnabledExperimental(true);
                    }
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setNewSetupSubBudget(String(pillarDiff));
                    setIsAddingSetupSub(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
                  <Text style={styles.centerAddCategoryBtnText}>
                    {pillarDiff <= 0 ? 'Pillar Budget Full' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addSubFormBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>
                    + New {activeSetupCat === 'needs' ? 'Need' : activeSetupCat === 'wants' ? 'Want' : 'Savings'} (Max {data.currency}{pillarDiff})
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
                        UIManager.setLayoutAnimationEnabledExperimental(true);
                      }
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setIsAddingSetupSub(false);
                      setNewSetupSubName('');
                      setNewSetupSubBudget('');
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={18} color="#8A8A8A" />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TextInput
                    value={newSetupSubName}
                    onChangeText={setNewSetupSubName}
                    placeholder="e.g. Gym, Pet Care, Gifts"
                    placeholderTextColor="#666666"
                    autoFocus
                    style={[styles.incomeSourceInputName, { flex: 1, backgroundColor: '#141414', borderWidth: 1, borderColor: '#242424', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }]}
                  />
                  <View style={[styles.incomeSourceAmountBox, { width: 95 }]}>
                    <Text style={{ color: '#8A8A8A', fontWeight: 'bold', fontSize: 12 }}>{data.currency}</Text>
                    <TextInput
                      value={newSetupSubBudget}
                      onChangeText={(val) => {
                        const num = parseFloat(val) || 0;
                        if (num > pillarDiff) {
                          setNewSetupSubBudget(String(pillarDiff));
                        } else {
                          setNewSetupSubBudget(val);
                        }
                      }}
                      placeholder={String(pillarDiff)}
                      placeholderTextColor="#666666"
                      keyboardType="numeric"
                      style={[styles.incomeSourceInputAmount, { width: 65 }]}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleAddSetupSubcategory();
                      if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
                        UIManager.setLayoutAnimationEnabledExperimental(true);
                      }
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setIsAddingSetupSub(false);
                    }}
                    disabled={!newSetupSubName.trim() || pillarDiff <= 0}
                    style={[styles.actionPillWhite, { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, opacity: newSetupSubName.trim() && pillarDiff > 0 ? 1 : 0.4 }]}
                  >
                    <Plus size={14} color="#090909" strokeWidth={3} />
                    <Text style={[styles.actionPillWhiteText, { fontSize: 12.5 }]}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Step 4 Footer Navigation */}
          {(() => {
            const hasAnyOverBudget = ['needs', 'wants', 'savings'].some((catKey) => {
              const cap = catKey === 'needs' ? allocNeeds : catKey === 'wants' ? allocWants : allocSavings;
              const total = (setupCategories[catKey] || []).reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);
              return total > cap;
            });

            return (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity style={styles.onboardingBackBtn} onPress={() => setOnboardingStep(3)}>
                  <ArrowLeft size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.onboardingPrimaryBtn,
                    { flex: 1 },
                    hasAnyOverBudget && { opacity: 0.4, backgroundColor: '#181818' },
                  ]}
                  disabled={hasAnyOverBudget}
                  onPress={() => {
                    const formattedSources = setupIncome
                      .filter((s) => parseFloat(s.amount) > 0)
                      .map((s) => ({
                        id: s.id || `inc-${Date.now()}`,
                        name: s.name.trim() || 'Salary',
                        amount: parseFloat(s.amount) || 0,
                      }));

                    const newCategories = [
                      {
                        id: 'needs',
                        name: 'Needs',
                        targetPercent: setupPercent.needs,
                        budget: allocNeeds,
                        subcategories: (setupCategories.needs || []).map((s) => ({
                          id: s.id || `sub-${Date.now()}-${Math.random()}`,
                          name: s.name.trim() || 'Need',
                          budget: parseFloat(s.budget) || 0,
                          icon: s.icon || 'House',
                        })),
                      },
                      {
                        id: 'wants',
                        name: 'Wants',
                        targetPercent: setupPercent.wants,
                        budget: allocWants,
                        subcategories: (setupCategories.wants || []).map((s) => ({
                          id: s.id || `sub-${Date.now()}-${Math.random()}`,
                          name: s.name.trim() || 'Want',
                          budget: parseFloat(s.budget) || 0,
                          icon: s.icon || 'ShoppingBag',
                        })),
                      },
                      {
                        id: 'savings',
                        name: 'Savings',
                        targetPercent: setupPercent.savings,
                        budget: allocSavings,
                        subcategories: (setupCategories.savings || []).map((s) => ({
                          id: s.id || `sub-${Date.now()}-${Math.random()}`,
                          name: s.name.trim() || 'Savings',
                          budget: parseFloat(s.budget) || 0,
                          icon: s.icon || 'ShieldCheck',
                        })),
                      },
                    ];

                    saveData({
                      ...data,
                      isOnboarded: true,
                      months: {
                        ...data.months,
                        [data.selectedMonthId]: {
                          ...currentMonthData,
                          incomeSources: formattedSources,
                          categories: newCategories,
                          transactions: [],
                        },
                      },
                    });
                    setCurrentTab('home');
                  }}
                >
                  <Text style={[styles.onboardingPrimaryBtnText, hasAnyOverBudget && { color: '#888888' }]}>
                    Let's Go
                  </Text>
                  <ArrowRight size={18} color={hasAnyOverBudget ? '#888888' : '#090909'} strokeWidth={2.8} />
                </TouchableOpacity>
              </View>
            );
          })()}
        </View>
      );
    }
  };

  // ----------------------------------------------------
  // 1. DASHBOARD: DARK UPPER SECTION + FLOATING WHITE RECENT TRANSACTIONS SHEET
  // ----------------------------------------------------
  // ----------------------------------------------------
  // 1. DASHBOARD: SLIDE 1 (BIG NUMPAD & CENTERED REMAINING PILL) | SLIDE 2 (MONTHLY BUDGET & RECENT TX)
  // ----------------------------------------------------
  const getAmountSplit = (rawStr, currencySym) => {
    const s = rawStr || '0';
    if (s.includes('.')) {
      const parts = s.split('.');
      const intNum = parseFloat(parts[0] || '0');
      const decPart = parts[1] !== undefined ? `.${parts[1]}` : '.00';
      return {
        intStr: `${currencySym}${intNum.toLocaleString('en-IN')}`,
        decStr: decPart,
      };
    } else {
      const intNum = parseFloat(s || '0');
      return {
        intStr: `${currencySym}${intNum.toLocaleString('en-IN')}`,
        decStr: '.00',
      };
    }
  };

  const renderHome = () => {
    const currencyIsoCode =
      data.currency === '₹'
        ? 'INR'
        : data.currency === '$'
        ? 'USD'
        : data.currency === '€'
        ? 'EUR'
        : data.currency === '£'
        ? 'GBP'
        : 'USD';
    const splitAmount = getAmountSplit(homeAmountStr, data.currency);

    return (
      <View style={{ flex: 1, backgroundColor: '#090909' }}>
        {/* Top Header Row: Month Selector | Avatar */}
        <View style={[styles.dashboardTopRow, { marginHorizontal: 20, marginTop: 4, marginBottom: 6 }]}>
          <TouchableOpacity
            style={styles.monthSelectPill}
            onPress={() => setIsMonthPickerOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.monthSelectText}>{currentMonthData.monthName}</Text>
            <ChevronDown size={14} color="#D6D6D6" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={styles.dashboardAvatar}>
            <Text style={styles.dashboardAvatarText}>{(data?.userName || 'U').charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Horizontal Swipeable Container */}
        <ScrollView
          ref={homeScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setHomeSlide(page);
          }}
          style={{ flex: 1 }}
        >
          {/* SLIDE 0: KEYPAD EXPENSE ENTRY */}
          <View
            style={{
              width: SCREEN_WIDTH,
              paddingHorizontal: 16,
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: Math.max(16, insets.bottom + 85),
            }}
          >
            {/* Middle Section: INR on Left & Big Amount on Right (End-to-End Horizontally, Centered Vertically) */}
            <View style={styles.homeAmountCenterWrapper}>
              <View style={styles.homeAmountEndToEndRow}>
                <Text style={styles.homeCurrencyIsoCode}>{currencyIsoCode}</Text>

                <View style={styles.homeAmountSplitTextRow}>
                  <Text style={styles.homeAmountBigInteger} numberOfLines={1}>
                    {splitAmount.intStr}
                  </Text>
                  <Text style={styles.homeAmountSmallFraction}>{splitAmount.decStr}</Text>
                </View>
              </View>
            </View>

            {/* Expanded Height Keypad Container Card */}
            <View style={styles.homeKeypadContainerCard}>
              {/* Total Balance Pill Overlapping Top Edge (Pushed Higher) */}
              <View style={styles.homeTotalBalancePillBadge}>
                <Text style={styles.homeTotalBalancePillLabel}>Total Balance: </Text>
                <Text style={styles.homeTotalBalancePillValue}>
                  {formatCurr(calculations.totalBalance)}
                </Text>
              </View>

              {/* 4x3 Grid of Key Tiles */}
              <View style={styles.homeKeyTilesGrid}>
                {/* Row 1 */}
                <View style={styles.homeKeyTileRow}>
                  {['1', '2', '3'].map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.homeKeyTileBtn}
                      onPress={() => handleHomeKeypadPress(k)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.homeKeyTileNum}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Row 2 */}
                <View style={styles.homeKeyTileRow}>
                  {['4', '5', '6'].map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.homeKeyTileBtn}
                      onPress={() => handleHomeKeypadPress(k)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.homeKeyTileNum}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Row 3 */}
                <View style={styles.homeKeyTileRow}>
                  {['7', '8', '9'].map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.homeKeyTileBtn}
                      onPress={() => handleHomeKeypadPress(k)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.homeKeyTileNum}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Row 4: Backspace (in place of .) | 0 | Action Tick */}
                <View style={styles.homeKeyTileRow}>
                  <TouchableOpacity
                    style={styles.homeKeyTileBtn}
                    onPress={() => handleHomeKeypadPress('backspace')}
                    activeOpacity={0.7}
                  >
                    <Delete size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.homeKeyTileBtn}
                    onPress={() => handleHomeKeypadPress('0')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.homeKeyTileNum}>0</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.homeKeyTileBtn,
                      parseFloat(homeAmountStr || '0') > 0 ? styles.homeKeyTileBtnActive : styles.homeKeyTileBtnIdle,
                    ]}
                    onPress={() => {
                      if (parseFloat(homeAmountStr || '0') > 0) {
                        handleQuickAddExpense();
                      }
                    }}
                    disabled={parseFloat(homeAmountStr || '0') <= 0}
                    activeOpacity={0.8}
                  >
                    <Check
                      size={28}
                      color={parseFloat(homeAmountStr || '0') > 0 ? '#000000' : '#44444A'}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* SLIDE 1: OVERVIEW (Monthly Budget & Recent Transactions) */}
          <View
            style={{
              width: SCREEN_WIDTH,
              paddingHorizontal: 16,
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: Math.max(16, insets.bottom + 85),
            }}
          >
            {/* Top Section: Monthly Budget Card */}
            <View style={[styles.charcoalBudgetCard, { backgroundColor: '#1A1A1E', borderColor: '#28282E', marginBottom: 0, marginTop: 4 }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardLabelCharcoal}>MONTHLY BUDGET</Text>
                <View style={styles.budgetPercentPill}>
                  <Text style={styles.budgetPercentText}>{calculations.percentSpent}% used</Text>
                </View>
              </View>

              <Text style={styles.budgetTotalLarge}>{formatCurr(calculations.totalIncome)}</Text>

              <View style={styles.budgetMetaRow}>
                <Text style={styles.budgetMetaText}>
                  Spent <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{formatCurr(calculations.totalSpent)}</Text>
                </Text>
                <Text style={styles.budgetMetaText}>
                  Remaining <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{formatCurr(calculations.totalBalance)}</Text>
                </Text>
              </View>

              {/* High-Contrast Progress Bar */}
              <View style={styles.progressTrackDark}>
                <View
                  style={[
                    styles.progressFillLight,
                    { width: `${Math.min(100, Math.max(5, calculations.percentSpent))}%` },
                  ]}
                />
              </View>
            </View>

            {/* Bottom Section: Recent Transactions Card (Matching 366px height to Keypad Card) */}
            <View style={[styles.charcoalBudgetCard, { height: 366, backgroundColor: '#151518', borderColor: '#222228', padding: 14, marginBottom: 0 }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardLabelCharcoal}>RECENT TRANSACTIONS</Text>
                <TouchableOpacity onPress={() => setCurrentTab('budget')}>
                  <Text style={styles.charcoalCardLink}>View all ({calculations.transactions.length})</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {/* Over-Budget Warnings Alert Card if any */}
                {calculations.overBudgetSubcategories.length > 0 && (
                  <View style={{ marginBottom: 10, gap: 6 }}>
                    {calculations.overBudgetSubcategories.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        style={[styles.overBudgetAlertRow, { padding: 8 }]}
                        onPress={() => setSelectedSubDetail({ catId: sub.parentCatId, subId: sub.id })}
                        activeOpacity={0.8}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                            <RenderCategoryIcon iconName={sub.icon} size={12} color="#FFFFFF" bgColor="#222222" />
                            <Text style={{ fontSize: 11.5, fontWeight: 'bold', color: '#FFFFFF' }} numberOfLines={1}>
                              {sub.name} (Over Limit)
                            </Text>
                          </View>
                          <View style={styles.overBadgePill}>
                            <Text style={styles.overBadgePillText}>+{formatCurr(sub.overAmount)}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={{ gap: 8 }}>
                  {calculations.transactions.length === 0 ? (
                    <View style={styles.emptyDarkState}>
                      <Text style={styles.emptyDarkText}>No transactions recorded for this month</Text>
                    </View>
                  ) : (
                    calculations.transactions.slice(0, 10).map((tx) => (
                      <TouchableOpacity
                        key={tx.id}
                        style={[styles.darkTxCard, { backgroundColor: '#1E1E24', borderColor: '#2A2A32' }]}
                        onPress={() => setEditingTransaction(tx)}
                        activeOpacity={0.7}
                      >
                        <RenderCategoryIcon iconName={tx.icon} size={15} color="#FFFFFF" bgColor="#282830" />
                        <View style={styles.darkTxDetails}>
                          <Text style={styles.darkTxTitle} numberOfLines={1}>{tx.title}</Text>
                          <Text style={styles.darkTxSub} numberOfLines={1}>
                            {tx.categoryId === 'needs' ? 'Needs' : tx.categoryId === 'wants' ? 'Wants' : 'Savings'} → {tx.subcategoryName || 'General'} · {tx.date}
                          </Text>
                        </View>
                        <Text style={styles.darkTxAmount}>− {formatCurr(tx.amount)}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {/* 100% FIXED CAROUSEL DOTS - Positioned precisely above Total Balance Pill & Same in Second Slide */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            bottom: Math.max(16, insets.bottom + 85) + 394,
            left: 0,
            right: 0,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
          }}
        >
          <View style={styles.homeCarouselDotsWrapper}>
            <TouchableOpacity
              onPress={() => {
                setHomeSlide(0);
                homeScrollRef.current?.scrollTo({ x: 0, animated: true });
              }}
              style={[styles.carouselDot, homeSlide === 0 ? styles.carouselDotActive : styles.carouselDotInactive]}
              activeOpacity={0.8}
            />
            <TouchableOpacity
              onPress={() => {
                setHomeSlide(1);
                homeScrollRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: true });
              }}
              style={[styles.carouselDot, homeSlide === 1 ? styles.carouselDotActive : styles.carouselDotInactive]}
              activeOpacity={0.8}
            />
          </View>
        </View>
      </View>
    );
  };

  // ----------------------------------------------------
  // 2. DARK SLIDE-IN CATEGORIZE & SAVE EXPENSE BOTTOM SHEET
  // ----------------------------------------------------
  const renderAddExpenseModal = () => {
    const curCat = currentMonthData.categories.find((c) => c.id === selectedCatId);
    const curSub = curCat?.subcategories.find((s) => s.id === selectedSubId) || curCat?.subcategories[0];

    // Real-time over-budget warning calculations
    const enteredNum = parseFloat(amountStr || '0') || 0;
    const catStats = calculations.categoryStats.find((c) => c.id === selectedCatId);
    const subStats = catStats?.subcategories?.find((s) => s.id === curSub?.id);
    const currentSubSpent = subStats?.spent || 0;
    const subLimit = Number(curSub?.budget || 0);
    const projectedSpent = currentSubSpent + enteredNum;
    const willExceed = selectedCatId !== 'savings' && subLimit > 0 && projectedSpent > subLimit;
    const exceedByAmount = projectedSpent - subLimit;
    const projectedPercent = subLimit > 0 ? Math.round((projectedSpent / subLimit) * 100) : 0;

    return (
      <Modal
        visible={isAddExpenseOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddExpenseOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.darkModalBackdropBottom}
        >
          <TouchableOpacity
            style={styles.modalDismissTouchable}
            activeOpacity={1}
            onPress={() => setIsAddExpenseOpen(false)}
          />
          <View style={[styles.darkSlideInCard, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
            {/* Drag Handle */}
            <View style={styles.sheetHandleIndicatorDark} />

            {/* Header */}
            <View style={styles.darkSheetHeader}>
              <View>
                <Text style={styles.darkSheetHeading}>Categorize Expense</Text>
                <Text style={styles.darkSheetSubHeading}>Select pillar & subcategory</Text>
              </View>
              <TouchableOpacity
                style={styles.darkCloseCircleBtn}
                onPress={() => setIsAddExpenseOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color="#8A8A8A" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Giant Amount Display */}
              <View style={styles.darkGiantAmountContainer}>
                <Text style={styles.darkGiantAmountCurrency}>{data.currency}</Text>
                <Text style={styles.darkGiantAmountDigits} numberOfLines={1}>
                  {parseFloat(amountStr || '0').toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Category Pill Segmented Switcher: Needs | Wants | Savings */}
              <View style={styles.darkCategoryPillSegmentRow}>
                {['needs', 'wants', 'savings'].map((catKey) => {
                  const isSel = selectedCatId === catKey;
                  const catObj = currentMonthData.categories.find((c) => c.id === catKey);
                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => {
                        setSelectedCatId(catKey);
                        if (catObj?.subcategories?.length > 0) {
                          setSelectedSubId(catObj.subcategories[0].id);
                        }
                      }}
                      style={[styles.darkCategorySegmentPill, isSel && styles.darkCategorySegmentPillActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.darkCategorySegmentPillText, isSel && styles.darkCategorySegmentPillTextActive]}>
                        {catKey === 'needs' ? 'Needs' : catKey === 'wants' ? 'Wants' : 'Savings'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Dynamic Subcategories Horizontal Chips */}
              <View style={styles.darkSubcategoryChipsSection}>
                <Text style={styles.darkSubcategorySectionLabel}>SELECT SUBCATEGORY</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {curCat?.subcategories.map((sub) => {
                    const isSelected = selectedSubId === sub.id;
                    return (
                      <TouchableOpacity
                        key={sub.id}
                        style={[styles.darkSubChip, isSelected && styles.darkSubChipActive]}
                        onPress={() => setSelectedSubId(sub.id)}
                        activeOpacity={0.75}
                      >
                        <RenderCategoryIcon
                          iconName={sub.icon}
                          size={13}
                          color={isSelected ? '#090909' : '#FFFFFF'}
                          bgColor={isSelected ? '#FFFFFF' : '#222222'}
                        />
                        <Text style={[styles.darkSubChipText, isSelected && styles.darkSubChipTextActive]}>
                          {sub.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Live Over-Budget Warning Banner */}
              {willExceed && (
                <View style={styles.darkOverBudgetWarningBanner}>
                  <AlertTriangle size={16} color="#FF6B6B" strokeWidth={2.4} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.darkOverBudgetWarningTitle}>
                      Budget Exceeded Warning ({projectedPercent}%)
                    </Text>
                    <Text style={styles.darkOverBudgetWarningDesc}>
                      {curSub?.name} budget is {formatCurr(subLimit)}. This entry exceeds it by {formatCurr(exceedByAmount)} (Total: {formatCurr(projectedSpent)}).
                    </Text>
                  </View>
                </View>
              )}

              {/* Optional Title / Notes input */}
              <View style={styles.darkExpenseInputWrapper}>
                <TextInput
                  placeholder="Expense description (optional)"
                  placeholderTextColor="#666666"
                  value={expenseTitle}
                  onChangeText={setExpenseTitle}
                  style={styles.darkExpenseDescInput}
                />
              </View>
            </ScrollView>

            {/* Full-width High-Contrast Save Expense Action Button */}
            <TouchableOpacity
              style={styles.darkSaveExpenseBtn}
              onPress={handleAddExpense}
              activeOpacity={0.85}
            >
              <Check size={18} color="#090909" strokeWidth={3} />
              <Text style={styles.darkSaveExpenseBtnText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  // ----------------------------------------------------
  // 3. TRANSACTIONS SCREEN
  // ----------------------------------------------------
  const renderTransactions = () => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 95 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.darkDashboardArea}>
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity style={styles.screenBackBtn} onPress={() => setCurrentTab('home')}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Transactions</Text>
          <TouchableOpacity style={styles.screenAddBtn} onPress={() => setIsAddExpenseOpen(true)}>
            <Plus size={18} color="#090909" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        <View style={styles.charcoalBudgetCard}>
          <Text style={styles.cardLabelCharcoal}>MONTHLY LEDGER</Text>
          <Text style={styles.budgetTotalLarge}>{formatCurr(calculations.totalSpent)}</Text>
          <Text style={styles.budgetMetaText}>
            {calculations.transactions.length} total outgoing transactions for {currentMonthData.monthName}
          </Text>
        </View>
      </View>

      <View style={styles.floatingWhiteSheet}>
        <View style={styles.sheetHandleIndicator} />
        <Text style={styles.whiteSheetTitle}>All Entries ({calculations.transactions.length})</Text>

        <View style={{ gap: 4, marginTop: 8 }}>
          {calculations.transactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.whiteTxRow}
              onPress={() => setEditingTransaction(tx)}
              activeOpacity={0.7}
            >
              <RenderCategoryIcon iconName={tx.icon} size={15} color="#090909" bgColor="#F2F2F2" />
              <View style={styles.whiteTxDetails}>
                <Text style={styles.whiteTxTitle} numberOfLines={1}>{tx.title}</Text>
                <Text style={styles.whiteTxSub} numberOfLines={1}>
                  {tx.categoryId === 'needs' ? 'Needs' : tx.categoryId === 'wants' ? 'Wants' : 'Savings'} → {tx.subcategoryName || 'General'} · {tx.date}
                </Text>
              </View>
              <Text style={styles.whiteTxAmount}>− {formatCurr(tx.amount)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // ----------------------------------------------------
  // 4. BUDGET SCREEN
  // ----------------------------------------------------
  // ----------------------------------------------------
  // 4. BUDGET SCREEN (Matching uploaded design reference)
  // ----------------------------------------------------
  const renderBudget = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = Math.max(1, daysInMonth - now.getDate());

    const totalIncome = calculations.totalIncome || 50000;
    const totalSpent = calculations.totalSpent || 0;
    const totalBudget = calculations.totalAllocated > 0 ? calculations.totalAllocated : totalIncome;
    const totalRemaining = Math.max(0, totalBudget - totalSpent);
    const isTotalOver = totalSpent > totalBudget;
    const totalOverAmount = isTotalOver ? totalSpent - totalBudget : 0;
    const overallSpentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const clampedGaugePercent = Math.min(100, Math.max(0, overallSpentPercent));

    // Semi-circular arc parameters
    // Center at (140, 130), Radius = 95
    // Semi-circle length = PI * 95 = 298.45
    const arcLength = 298.45;
    const strokeOffset = arcLength * (1 - clampedGaugePercent / 100);

    // Pip needle angle
    const angleRad = Math.PI * (1 - clampedGaugePercent / 100);
    const pipX = 140 + 95 * Math.cos(angleRad);
    const pipY = 130 - 95 * Math.sin(angleRad);

    const getPillarColors = (catId) => {
      switch (catId) {
        case 'needs':
          return { bg: '#2B1D22', iconColor: '#FFA3B8' };
        case 'wants':
          return { bg: '#241E34', iconColor: '#C4B5FD' };
        case 'savings':
          return { bg: '#182B22', iconColor: '#86EFAC' };
        default:
          return { bg: '#242424', iconColor: '#FFFFFF' };
      }
    };

    const getSubcategoryColors = (subId, iconName) => {
      switch (iconName) {
        case 'House':
        case 'Activity':
          return { bg: '#2B1D22', iconColor: '#FFA3B8' };
        case 'ShoppingBasket':
        case 'UtensilsCrossed':
          return { bg: '#2E2218', iconColor: '#FDBA74' };
        case 'Zap':
          return { bg: '#2A2616', iconColor: '#FDE047' };
        case 'Car':
        case 'Repeat':
          return { bg: '#1C2432', iconColor: '#93C5FD' };
        case 'ShoppingBag':
        case 'Gamepad2':
          return { bg: '#261C32', iconColor: '#E9D5FF' };
        case 'ShieldCheck':
        case 'TrendingUp':
        case 'ArrowDownRight':
          return { bg: '#182B22', iconColor: '#86EFAC' };
        default:
          return { bg: '#242424', iconColor: '#FFFFFF' };
      }
    };

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 95, paddingTop: insets.top + 6 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row: Budgets + new button */}
        <View style={styles.budgetTopHeaderRow}>
          <Text style={styles.budgetScreenTitle}>Budgets</Text>
          <TouchableOpacity
            style={styles.budgetNewPillBtn}
            onPress={() => setIsAddExpenseOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
            <Text style={styles.budgetNewPillText}>new</Text>
          </TouchableOpacity>
        </View>

        {/* Speedometer / Arc Gauge Section */}
        <View style={styles.gaugeCardContainer}>
          <Text style={styles.gaugeTopLabel}>OVERALL SPENT: {overallSpentPercent}%</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 145, marginTop: 2 }}>
            <Svg width={280} height={145} viewBox="0 0 280 145">
              {/* Background Track */}
              <Path
                d="M 45,130 A 95,95 0 0,1 235,130"
                stroke="#252525"
                strokeWidth={22}
                strokeLinecap="round"
                fill="none"
              />
              {/* Active White Fill */}
              <Path
                d="M 45,130 A 95,95 0 0,1 235,130"
                stroke="#FFFFFF"
                strokeWidth={22}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${arcLength}`}
                strokeDashoffset={strokeOffset}
              />
              {/* Pip pointer indicator */}
              {clampedGaugePercent > 3 && clampedGaugePercent < 97 && (
                <Circle cx={pipX} cy={pipY} r={5} fill="#090909" stroke="#FFFFFF" strokeWidth={2.5} />
              )}
            </Svg>

            {/* Metric Overlay inside Arch */}
            <View style={styles.gaugeCenterTextOverlay}>
              <Text style={styles.gaugeMainAmount} numberOfLines={1}>
                {isTotalOver ? `+${data.currency}${totalOverAmount.toLocaleString('en-IN')}` : `${data.currency}${totalRemaining.toLocaleString('en-IN')}`}
              </Text>
              <Text style={[styles.gaugeSubLabel, isTotalOver && { color: '#FF7070' }]}>
                {isTotalOver ? 'over this month' : 'left this month'}
              </Text>
            </View>
          </View>

          {/* Left & Right Corner Labels */}
          <View style={styles.gaugeBottomLabelsRow}>
            <Text style={styles.gaugeCornerLabel}>{data.currency}{totalSpent.toLocaleString('en-IN')}</Text>
            <Text style={styles.gaugeCornerLabel}>{data.currency}{totalBudget.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Category Pillars (Needs, Wants, Savings) Cards List */}
        <View style={{ paddingHorizontal: 18, marginTop: 12, gap: 10 }}>
          {currentMonthData.categories.map((cat) => {
            const catStat = calculations.categoryStats.find((c) => c.id === cat.id) || {
              ...cat,
              spent: 0,
              remaining: cat.budget || 0,
              percentSpent: 0,
              isCatOverBudget: false,
              catOverAmount: 0,
            };
            const isExpanded = !!expandedPillars[cat.id];
            const pillarColors = getPillarColors(cat.id);
            const isOver = catStat.isCatOverBudget;
            const remaining = catStat.remaining;
            const overAmount = catStat.catOverAmount;

            return (
              <View
                key={cat.id}
                style={[
                  styles.budgetCard,
                  isOver && styles.budgetCardOverBudget,
                ]}
              >
                {/* Main Clickable Pillar Header Card */}
                <TouchableOpacity
                  onPress={() => togglePillar(cat.id)}
                  activeOpacity={0.8}
                  style={styles.budgetCardContent}
                >
                  <View style={styles.budgetCardLeft}>
                    {/* Soft Tinted Icon Box */}
                    <View style={[styles.budgetIconBox, { backgroundColor: pillarColors.bg }]}>
                      <RenderCategoryIcon
                        iconName={cat.id === 'needs' ? 'House' : cat.id === 'wants' ? 'ShoppingBag' : 'ShieldCheck'}
                        size={18}
                        color={pillarColors.iconColor}
                        bgColor="transparent"
                      />
                    </View>

                    {/* Category Name & Subtitle */}
                    <View style={styles.budgetTitleRow}>
                      <Text style={styles.budgetCardTitle}>{cat.name}</Text>
                      <Text style={styles.budgetCardSubtitle}>
                        {daysLeft}d left • {catStat.percentSpent}% spent
                      </Text>
                    </View>
                  </View>

                  {/* Right Amount & Status */}
                  <View style={styles.budgetCardRight}>
                    <Text style={[styles.budgetCardAmount, isOver && { color: '#FF7070' }]}>
                      {isOver ? `+${data.currency}${overAmount.toLocaleString('en-IN')}` : `${data.currency}${remaining.toLocaleString('en-IN')}`}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={isOver ? styles.budgetCardOverText : styles.budgetCardUnderText}>
                        {isOver ? 'over this month' : 'under this month'}
                      </Text>
                      {isExpanded ? (
                        <ChevronDown size={14} color="#8A8A8A" />
                      ) : (
                        <ChevronRight size={14} color="#8A8A8A" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Expanded Subcategories Accordion Content */}
                {isExpanded && (
                  <View style={styles.budgetExpandedWrapper}>
                    <View style={{ gap: 8 }}>
                      {cat.subcategories.map((sub) => {
                        const subStat = catStat.subcategories?.find((s) => s.id === sub.id) || {
                          ...sub,
                          spent: 0,
                          remaining: Number(sub.budget || 0),
                          percentSpent: 0,
                          actualPercentSpent: 0,
                          isOverBudget: false,
                          overAmount: 0,
                        };
                        const subColors = getSubcategoryColors(sub.id, sub.icon);
                        const isSubOver = subStat.isOverBudget;
                        const subRemaining = subStat.remaining;
                        const subOverAmount = subStat.overAmount;

                        return (
                          <View
                            key={sub.id}
                            style={[
                              styles.budgetSubCard,
                              isSubOver && styles.budgetSubCardOverBudget,
                            ]}
                          >
                            <TouchableOpacity
                              onPress={() => setSelectedSubDetail({ catId: cat.id, subId: sub.id })}
                              activeOpacity={0.75}
                              style={styles.budgetCardContent}
                            >
                              <View style={styles.budgetCardLeft}>
                                <View style={[styles.budgetIconBox, { backgroundColor: subColors.bg, width: 42, height: 42, borderRadius: 13 }]}>
                                  <RenderCategoryIcon
                                    iconName={sub.icon}
                                    size={16}
                                    color={subColors.iconColor}
                                    bgColor="transparent"
                                  />
                                </View>

                                <View style={styles.budgetTitleRow}>
                                  <Text style={[styles.budgetCardTitle, { fontSize: 15 }]}>{sub.name}</Text>
                                  <Text style={styles.budgetCardSubtitle}>
                                    {daysLeft}d left • {subStat.actualPercentSpent}% spent
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.budgetCardRight}>
                                <Text style={[styles.budgetCardAmount, { fontSize: 17 }, isSubOver && { color: '#FF7070' }]}>
                                  {isSubOver ? `+${data.currency}${subOverAmount.toLocaleString('en-IN')}` : `${data.currency}${subRemaining.toLocaleString('en-IN')}`}
                                </Text>
                                <Text style={isSubOver ? styles.budgetCardOverText : styles.budgetCardUnderText}>
                                  {isSubOver ? 'over this month' : 'under this month'}
                                </Text>
                              </View>
                            </TouchableOpacity>

                            {/* Subcategory Action Row */}
                            <View style={styles.budgetSubActionsRow}>
                              <TouchableOpacity
                                onPress={() => setSelectedSubDetail({ catId: cat.id, subId: sub.id })}
                                style={styles.budgetSubActionBtn}
                              >
                                <Text style={styles.budgetSubActionBtnText}>View Transactions</Text>
                                <ChevronRight size={12} color="#8A8A8A" />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => handleDeleteSubcategory(cat.id, sub.id)}
                                style={{ padding: 6 }}
                                activeOpacity={0.7}
                              >
                                <Trash2 size={13} color="#777777" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {/* Bottom Actions for Pillar */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1F1F1F' }}>
                      <TouchableOpacity
                        style={styles.budgetPillarAdjustBtn}
                        onPress={() => {
                          setTargetCatIdForNewSub(cat.id);
                          setIsAddSubcategoryOpen(true);
                        }}
                      >
                        <Plus size={13} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Add Subcategory</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.budgetPillarAdjustBtn}
                        onPress={handleOpenAdjustAllocation}
                      >
                        <SlidersHorizontal size={12} color="#A0A0A0" />
                        <Text style={styles.budgetPillarAdjustBtnText}>Adjust % ({cat.targetPercent || 0}%)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  // ----------------------------------------------------
  // 5. ANALYTICS SCREEN
  // ----------------------------------------------------
  const renderAnalytics = () => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.darkDashboardArea}>
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity style={styles.screenBackBtn} onPress={() => setCurrentTab('home')}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Analytics</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.charcoalBudgetCard}>
          <Text style={styles.cardLabelCharcoal}>SPENDING OVERVIEW</Text>
          <Text style={styles.budgetTotalLarge}>{formatCurr(calculations.totalSpent)}</Text>
          <Text style={styles.budgetMetaText}>{currentMonthData.monthName} Total Outgoing</Text>
        </View>
      </View>

      <View style={styles.floatingGreySheet}>
        <View style={styles.sheetHandleIndicator} />
        <Text style={styles.greySheetTitle}>Monthly Historical Trend</Text>

        <View style={styles.monochromeBarChartContainer}>
          {data.historicalMonthlyData.map((item, idx) => {
            const isSel = selectedMonthIndex === idx;
            const val = item.current ? calculations.totalSpent : item.spent;
            const heightPct = Math.min(100, Math.round((val / 50000) * 100));

            return (
              <TouchableOpacity key={item.month} style={styles.barColumn} onPress={() => setSelectedMonthIndex(idx)}>
                <View style={styles.barTrackArea}>
                  <View
                    style={[
                      styles.barFillArea,
                      isSel ? styles.barFillAreaActive : styles.barFillAreaInactive,
                      { height: `${heightPct}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.barMonthText, isSel && styles.barMonthTextActive]}>{item.month}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.greySheetTitle, { marginTop: 20 }]}>Pillar Breakdown</Text>
        <View style={{ gap: 12, marginTop: 10 }}>
          <View style={styles.greyBreakdownRow}>
            <View style={styles.greyBreakdownHeader}>
              <Text style={styles.greyBreakdownName}>Needs</Text>
              <Text style={styles.greyBreakdownVal}>{formatCurr(calculations.needs.spent)} ({calculations.needs.percentSpent}%)</Text>
            </View>
            <View style={styles.progressTrackLight}>
              <View style={[styles.progressFillBlack, { width: `${calculations.needs.percentSpent}%` }]} />
            </View>
          </View>

          <View style={styles.greyBreakdownRow}>
            <View style={styles.greyBreakdownHeader}>
              <Text style={styles.greyBreakdownName}>Wants</Text>
              <Text style={styles.greyBreakdownVal}>{formatCurr(calculations.wants.spent)} ({calculations.wants.percentSpent}%)</Text>
            </View>
            <View style={styles.progressTrackLight}>
              <View style={[styles.progressFillMediumGrey, { width: `${calculations.wants.percentSpent}%` }]} />
            </View>
          </View>

          <View style={styles.greyBreakdownRow}>
            <View style={styles.greyBreakdownHeader}>
              <Text style={styles.greyBreakdownName}>Savings</Text>
              <Text style={styles.greyBreakdownVal}>{formatCurr(calculations.savings.spent)} ({calculations.savings.percentSpent}%)</Text>
            </View>
            <View style={styles.progressTrackLight}>
              <View style={[styles.progressFillDarkGrey, { width: `${calculations.savings.percentSpent}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // ----------------------------------------------------
  // 6. SETTINGS SCREEN
  // ----------------------------------------------------
  const renderSettings = () => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.darkDashboardArea}>
        <View style={styles.screenHeaderRow}>
          <TouchableOpacity style={styles.screenBackBtn} onPress={() => setCurrentTab('home')}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.screenHeaderTitle}>Settings & Setup</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Configuration Charcoal Card */}
        <View style={[styles.charcoalBudgetCard, { marginTop: 14 }]}>
          <Text style={styles.cardLabelCharcoal}>CONFIGURATION</Text>

          <View style={{ gap: 10, marginTop: 12 }}>
            {/* Adjust 50/30/20 Allocation */}
            <TouchableOpacity
              style={styles.darkActionCard}
              onPress={handleOpenAdjustAllocation}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.darkActionCardTitle}>Adjust 50/30/20 Percentages</Text>
                <Text style={styles.darkActionCardSub}>Needs {customPercent.needs}% · Wants {customPercent.wants}% · Savings {customPercent.savings}%</Text>
              </View>
              <ChevronRight size={16} color="#8A8A8A" />
            </TouchableOpacity>

            {/* Rerun Onboarding Wizard */}
            <TouchableOpacity
              style={styles.darkActionCard}
              onPress={() => {
                setSetupIncome([{ id: '1', name: 'Monthly Salary', amount: '' }]);
                setSetupPercent({ needs: 50, wants: 30, savings: 20 });
                setOnboardingStep(1);
                saveData({ ...INITIAL_DATA, isOnboarded: false });
              }}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.darkActionCardTitle}>Start Over / Setup Wizard</Text>
                <Text style={styles.darkActionCardSub}>Set salary, allocation %, and restart from ₹0</Text>
              </View>
              <ChevronRight size={16} color="#8A8A8A" />
            </TouchableOpacity>

            {/* Reset to Clean Zero Data */}
            <TouchableOpacity
              style={styles.darkActionCard}
              onPress={() => {
                setSetupIncome([{ id: '1', name: 'Monthly Salary', amount: '' }]);
                setSetupPercent({ needs: 50, wants: 30, savings: 20 });
                setOnboardingStep(1);
                saveData({ ...INITIAL_DATA, isOnboarded: false });
              }}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.darkActionCardTitle}>Reset All Data to Zero</Text>
                <Text style={styles.darkActionCardSub}>Clear all transactions and return to initial setup</Text>
              </View>
              <ChevronRight size={16} color="#8A8A8A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090909" />

      {!data.isOnboarded ? (
        renderOnboarding()
      ) : (
        <>
          {/* Main Content View */}
          <View style={styles.mainContent}>
            {currentTab === 'home' && renderHome()}
            {currentTab === 'transactions' && renderTransactions()}
            {currentTab === 'budget' && renderBudget()}
            {currentTab === 'analytics' && renderAnalytics()}
            {currentTab === 'settings' && renderSettings()}
          </View>

          {/* FLOATING PILL BOTTOM NAVIGATION */}
          <View style={[styles.floatingBottomNavWrapper, { bottom: Math.max(18, insets.bottom + 10) }]}>
            <View style={styles.floatingNavPill}>
              {[
                { id: 'home', icon: Home },
                { id: 'budget', icon: Wallet },
                { id: 'settings', icon: Settings },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = currentTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.navPillItem, isSelected && styles.navPillItemActive]}
                    onPress={() => setCurrentTab(tab.id)}
                    activeOpacity={0.85}
                  >
                    <IconComp
                      size={24}
                      color={isSelected ? '#090909' : '#8A8A8A'}
                      strokeWidth={isSelected ? 2.6 : 2}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dark Categorize & Save Expense Slide-in Bottom Sheet Modal */}
          {renderAddExpenseModal()}

          {/* Month Selector Modal */}
          <Modal visible={isMonthPickerOpen} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalBackdropCenter}
              activeOpacity={1}
              onPress={() => setIsMonthPickerOpen(false)}
            >
              <View style={styles.monthPickerCard}>
                <Text style={styles.monthPickerTitle}>SELECT BUDGET MONTH</Text>
                {Object.values(data.months).map((m) => (
                  <TouchableOpacity
                    key={m.monthId}
                    style={[styles.monthItemRow, data.selectedMonthId === m.monthId && styles.monthItemRowActive]}
                    onPress={() => {
                      saveData({ ...data, selectedMonthId: m.monthId });
                      setIsMonthPickerOpen(false);
                    }}
                  >
                    <Text style={[styles.monthItemText, data.selectedMonthId === m.monthId && styles.monthItemTextActive]}>
                      {m.monthName}
                    </Text>
                    {data.selectedMonthId === m.monthId && <Check size={14} color="#090909" strokeWidth={3} />}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Adjust Allocation Ratio Modal */}
          <Modal visible={isAdjustAllocationOpen} transparent animationType="slide">
            <View style={styles.modalBackdropBottom}>
              <View style={[styles.modalLightSheet, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.lightModalHeaderRow}>
                  <View>
                    <Text style={styles.lightModalTitle}>Adjust Target Allocation</Text>
                    <Text style={styles.lightModalSub}>
                      Income: {formatCurr(calculations.totalIncome)} · {currentMonthData.monthName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.lightCloseCircleBtn}
                    onPress={() => setIsAdjustAllocationOpen(false)}
                  >
                    <X size={16} color="#090909" />
                  </TouchableOpacity>
                </View>

                {/* Presets */}
                <Text style={styles.lightSectionHeader}>QUICK PRESETS</Text>
                <View style={styles.lightPresetRow}>
                  {[
                    { label: '50/30/20 (Balanced)', n: 50, w: 30, s: 20 },
                    { label: '60/20/20 (Essentials)', n: 60, w: 20, s: 20 },
                    { label: '70/20/10 (Frugal)', n: 70, w: 20, s: 10 },
                    { label: '40/30/30 (Saver)', n: 40, w: 30, s: 30 },
                  ].map((p) => {
                    const isSelected =
                      customPercent.needs === p.n &&
                      customPercent.wants === p.w &&
                      customPercent.savings === p.s;
                    return (
                      <TouchableOpacity
                        key={p.label}
                        style={[styles.lightPresetPill, isSelected && styles.lightPresetPillActive]}
                        onPress={() => handleSelectPreset(p.n, p.w, p.s)}
                      >
                        <Text style={[styles.lightPresetPillText, isSelected && styles.lightPresetPillTextActive]}>
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Steppers */}
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
                  {[
                    { key: 'needs', label: 'NEEDS (Essentials)', sub: 'Rent, Groceries, Utilities, Transport', dot: '#090909' },
                    { key: 'wants', label: 'WANTS (Lifestyle)', sub: 'Dining Out, Shopping, Leisure', dot: '#8A8A8A' },
                    { key: 'savings', label: 'SAVINGS & DEBT', sub: 'Emergency Fund, Investments', dot: '#D6D6D6' },
                  ].map((cat) => (
                    <View key={cat.key} style={styles.lightStepperCard}>
                      <View style={styles.cardHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={[styles.dotIndicator, { backgroundColor: cat.dot }]} />
                          <Text style={styles.lightStepperName}>{cat.label}</Text>
                        </View>
                        <Text style={styles.lightStepperAmount}>
                          {formatCurr(Math.round((calculations.totalIncome * customPercent[cat.key]) / 100))}
                        </Text>
                      </View>
                      <Text style={styles.lightStepperSub}>{cat.sub}</Text>

                      <View style={styles.lightStepperControlsRow}>
                        <TouchableOpacity
                          style={styles.lightStepperCircle}
                          onPress={() => handleStepPercent(cat.key, -5)}
                        >
                          <Minus size={14} color="#090909" strokeWidth={2.5} />
                        </TouchableOpacity>

                        <Text style={styles.lightStepperPercentDigits}>{customPercent[cat.key]}%</Text>

                        <TouchableOpacity
                          style={styles.lightStepperCircle}
                          onPress={() => handleStepPercent(cat.key, 5)}
                        >
                          <Plus size={14} color="#090909" strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Live 100% Validation Status */}
                {(() => {
                  const totalPct = customPercent.needs + customPercent.wants + customPercent.savings;
                  const isBalanced = totalPct === 100;
                  return (
                    <View style={[styles.lightValidationBox, isBalanced ? styles.lightValidationBalanced : styles.lightValidationWarning]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Check size={14} color="#090909" strokeWidth={3} />
                        <Text style={styles.lightValidationText}>
                          {isBalanced ? '100% Total · Fully Allocated' : `Total is ${totalPct}% (${100 - totalPct > 0 ? (100 - totalPct) + '% unallocated' : (totalPct - 100) + '% over'})`}
                        </Text>
                      </View>
                      <Text style={styles.lightValidationAmount}>
                        {formatCurr(
                          Math.round((calculations.totalIncome * customPercent.needs) / 100) +
                            Math.round((calculations.totalIncome * customPercent.wants) / 100) +
                            Math.round((calculations.totalIncome * customPercent.savings) / 100)
                        )}
                      </Text>
                    </View>
                  );
                })()}

                {/* Apply Button */}
                <TouchableOpacity
                  style={[
                    styles.saveExpenseBtn,
                    { marginTop: 10, opacity: customPercent.needs + customPercent.wants + customPercent.savings === 100 ? 1 : 0.4 },
                  ]}
                  disabled={customPercent.needs + customPercent.wants + customPercent.savings !== 100}
                  onPress={handleSaveAllocationPercentages}
                >
                  <Text style={styles.saveExpenseBtnText}>Apply New Allocations</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Edit Transaction Modal */}
          <Modal visible={!!editingTransaction} transparent animationType="slide">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdropBottom}>
              <View style={[styles.modalLightSheet, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styles.lightModalTitle}>Edit Transaction</Text>
                {editingTransaction && (
                  <>
                    <TextInput
                      value={editingTransaction.title}
                      onChangeText={(val) => setEditingTransaction({ ...editingTransaction, title: val })}
                      placeholder="Title"
                      placeholderTextColor="#8A8A8A"
                      style={styles.lightTextInput}
                    />
                    <TextInput
                      value={String(editingTransaction.amount)}
                      onChangeText={(val) => setEditingTransaction({ ...editingTransaction, amount: val })}
                      placeholder="Amount"
                      placeholderTextColor="#8A8A8A"
                      keyboardType="numeric"
                      style={styles.lightTextInput}
                    />
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      <TouchableOpacity
                        style={[styles.saveExpenseBtn, { flex: 1 }]}
                        onPress={() =>
                          handleUpdateTransaction(
                            editingTransaction.id,
                            editingTransaction.amount,
                            editingTransaction.title,
                            editingTransaction.categoryId,
                            editingTransaction.subcategoryId,
                            editingTransaction.notes
                          )
                        }
                      >
                        <Text style={styles.saveExpenseBtnText}>Save Changes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtnSquare}
                        onPress={() => {
                          handleDeleteTransaction(editingTransaction.id);
                          setEditingTransaction(null);
                        }}
                      >
                        <Trash2 size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ padding: 8, alignItems: 'center', marginTop: 4 }} onPress={() => setEditingTransaction(null)}>
                      <Text style={{ color: '#8A8A8A', fontSize: 12 }}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Add Subcategory Modal */}
          <Modal visible={isAddSubcategoryOpen} transparent animationType="slide">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdropBottom}>
              <View style={[styles.modalLightSheet, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styles.lightModalTitle}>Add Subcategory</Text>
                <TextInput
                  placeholder="Name (e.g. Medical, Education)"
                  placeholderTextColor="#8A8A8A"
                  value={newSubName}
                  onChangeText={setNewSubName}
                  style={styles.lightTextInput}
                />
                <TextInput
                  placeholder="Monthly Budget Limit"
                  placeholderTextColor="#8A8A8A"
                  value={newSubBudget}
                  onChangeText={setNewSubBudget}
                  keyboardType="numeric"
                  style={styles.lightTextInput}
                />
                <TouchableOpacity style={styles.saveExpenseBtn} onPress={handleAddSubcategory}>
                  <Text style={styles.saveExpenseBtnText}>Create Subcategory</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 8, alignItems: 'center', marginTop: 4 }} onPress={() => setIsAddSubcategoryOpen(false)}>
                  <Text style={{ color: '#8A8A8A', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Subcategory Detail & Warnings Modal */}
          <Modal visible={!!selectedSubDetail} transparent animationType="slide">
            <View style={styles.modalBackdropBottom}>
              <View style={[styles.modalLightSheet, { paddingBottom: insets.bottom + 20 }]}>
                {(() => {
                  if (!selectedSubDetail) return null;
                  const catStat = calculations.categoryStats.find((c) => c.id === selectedSubDetail.catId);
                  const subStat = catStat?.subcategories?.find((s) => s.id === selectedSubDetail.subId);
                  if (!subStat) return null;

                  const subTxList = currentMonthData.transactions.filter(
                    (t) => t.subcategoryId === subStat.id || (t.categoryId === catStat.id && t.subcategoryName === subStat.name)
                  );

                  return (
                    <>
                      <View style={styles.lightModalHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <RenderCategoryIcon
                            iconName={subStat.icon}
                            size={18}
                            color="#090909"
                            bgColor="#EEEEEE"
                          />
                          <View>
                            <Text style={styles.lightModalTitle}>{subStat.name}</Text>
                            <Text style={styles.lightModalSub}>
                              {catStat.name} · {currentMonthData.monthName}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.lightCloseCircleBtn}
                          onPress={() => setSelectedSubDetail(null)}
                        >
                          <X size={16} color="#090909" />
                        </TouchableOpacity>
                      </View>

                      {/* Over-Budget Warning Banner if exceeded */}
                      {subStat.isOverBudget && (
                        <View style={styles.detailWarningBanner}>
                          <AlertTriangle size={18} color="#FFFFFF" strokeWidth={2.5} />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.detailWarningTitle}>
                              ⚠️ Budget Exceeded by {formatCurr(subStat.overAmount)}
                            </Text>
                            <Text style={styles.detailWarningDesc}>
                              You have spent {formatCurr(subStat.spent)} of your {formatCurr(subStat.budget)} monthly limit ({subStat.actualPercentSpent}% allocated).
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Summary stats */}
                      <View style={styles.subDetailStatsRow}>
                        <View style={styles.subDetailStatBox}>
                          <Text style={styles.subDetailStatLabel}>MONTHLY BUDGET</Text>
                          <Text style={styles.subDetailStatValue}>{formatCurr(subStat.budget)}</Text>
                        </View>
                        <View style={styles.subDetailStatBox}>
                          <Text style={styles.subDetailStatLabel}>TOTAL SPENT</Text>
                          <Text style={[styles.subDetailStatValue, subStat.isOverBudget && { color: '#090909', fontWeight: '900' }]}>
                            {formatCurr(subStat.spent)}
                          </Text>
                        </View>
                        <View style={styles.subDetailStatBox}>
                          <Text style={styles.subDetailStatLabel}>{subStat.isOverBudget ? 'OVERSPENT' : 'REMAINING'}</Text>
                          <Text style={[styles.subDetailStatValue, subStat.isOverBudget && { color: '#090909', fontWeight: '900' }]}>
                            {subStat.isOverBudget ? `+${formatCurr(subStat.overAmount)}` : formatCurr(subStat.remaining)}
                          </Text>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={[styles.progressTrackLight, { marginVertical: 12 }]}>
                        <View
                          style={[
                            styles.progressFillBlack,
                            { width: `${Math.min(100, Math.max(3, subStat.actualPercentSpent))}%` },
                          ]}
                        />
                      </View>

                      {/* Subcategory Transactions */}
                      <Text style={[styles.lightSectionHeader, { marginTop: 4 }]}>
                        TRANSACTIONS ({subTxList.length})
                      </Text>
                      <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
                        {subTxList.length === 0 ? (
                          <Text style={{ color: '#8A8A8A', fontSize: 12, paddingVertical: 10, textAlign: 'center' }}>
                            No entries for this subcategory yet
                          </Text>
                        ) : (
                          subTxList.map((tx) => (
                            <View key={tx.id} style={styles.subDetailTxRow}>
                              <View>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#090909' }}>{tx.title}</Text>
                                <Text style={{ fontSize: 11, color: '#8A8A8A' }}>{tx.date}</Text>
                              </View>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#090909' }}>
                                − {formatCurr(tx.amount)}
                              </Text>
                            </View>
                          ))
                        )}
                      </ScrollView>

                      {/* Actions */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                        <TouchableOpacity
                          style={[styles.saveExpenseBtn, { flex: 1 }]}
                          onPress={() => {
                            setSelectedCatId(catStat.id);
                            setSelectedSubId(subStat.id);
                            setSelectedSubDetail(null);
                            setIsAddExpenseOpen(true);
                          }}
                        >
                          <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                          <Text style={styles.saveExpenseBtnText}>+ Add Expense</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteBtnSquare}
                          onPress={() => handleDeleteSubcategory(catStat.id, subStat.id)}
                        >
                          <Trash2 size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                })()}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

// Apply Premium Poppins as default font across the entire mobile app
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.style = { fontFamily: 'Poppins_500Medium' };

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.style = { fontFamily: 'Poppins_500Medium' };

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    'Poppins-Light': Poppins_300Light,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'Poppins-Black': Poppins_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#090909' }}>
        <StatusBar barStyle="light-content" backgroundColor="#090909" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

// ----------------------------------------------------
// MONOCHROME DESIGN SYSTEM STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090909',
  },
  mainContent: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#090909',
  },
  scrollContent: {
    flexGrow: 1,
  },
  iconContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dark Upper Dashboard Section
  darkDashboardArea: {
    backgroundColor: '#090909',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  dashboardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goodMorningText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  monthSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  monthSelectText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dashboardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Large Hero Balance Section
  heroBalanceSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  heroBalanceDigits: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroBalanceSubLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '500',
    marginTop: 4,
  },
  // Quick Action Pills Row
  pillActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 12,
  },
  actionPillWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  actionPillWhiteText: {
    color: '#090909',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionPillCharcoal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#292929',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  actionPillCharcoalText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  // Floating Charcoal Cards
  charcoalBudgetCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 24,
    padding: 18,
    marginTop: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabelCharcoal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 1,
  },
  budgetPercentPill: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  budgetPercentText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D6D6D6',
  },
  budgetTotalLarge: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  budgetMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  budgetMetaText: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  progressTrackDark: {
    height: 5,
    backgroundColor: '#242424',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFillLight: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressFillGrey: {
    height: '100%',
    backgroundColor: '#8A8A8A',
    borderRadius: 3,
  },
  progressFillWhite: {
    height: '100%',
    backgroundColor: '#D6D6D6',
    borderRadius: 3,
  },
  // Categories Section
  categoriesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  categoriesHeaderTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 1,
  },
  adjustPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  adjustPillBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  charcoalCategoryCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 22,
    padding: 16,
    marginTop: 8,
  },
  categoryCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  categoryRemainingDigits: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  categorySubNote: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#8A8A8A',
  },
  categoryMetaLine: {
    fontSize: 10.5,
    color: '#666666',
    marginTop: 2,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subGridContainer: {
    marginTop: 12,
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  subPillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    padding: 8,
    borderRadius: 14,
  },
  subPillName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subPillBudget: {
    fontSize: 10,
    color: '#8A8A8A',
  },
  // FLOATING LIGHT GREY ROUNDED OVERLAPPING CONTENT PANEL
  floatingGreySheet: {
    backgroundColor: '#F4F4F6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: 340,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandleIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 16,
  },
  greySheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  greySheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#090909',
  },
  charcoalCardLink: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  darkTxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282828',
  },
  darkTxDetails: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  darkTxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkTxSub: {
    fontSize: 10.5,
    color: '#8A8A8A',
    marginTop: 1,
  },
  darkTxAmount: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyDarkState: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282828',
  },
  emptyDarkText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  greyTxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8EE',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCDBE2',
  },
  greyTxDetails: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  greyTxTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#090909',
  },
  greyTxSub: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 1,
  },
  greyTxAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#090909',
  },
  emptyGreyState: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#E8E8EE',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCDBE2',
  },
  emptyGreyText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  // LIGHT SURFACE ADD EXPENSE SCREEN
  lightAddExpenseContainer: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  lightSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  lightCloseCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DFDFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightSheetHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#090909',
  },
  giantAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  giantAmountCurrency: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A8A8A',
    marginRight: 4,
  },
  giantAmountDigits: {
    fontSize: 48,
    fontWeight: '900',
    color: '#090909',
  },
  categoryPillSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#E8E8EE',
    borderWidth: 1,
    borderColor: '#DCDBE2',
    padding: 4,
    borderRadius: 999,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  categorySegmentPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 999,
  },
  categorySegmentPillActive: {
    backgroundColor: '#090909',
  },
  categorySegmentPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  categorySegmentPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subcategoryChipsSection: {
    marginVertical: 4,
  },
  subcategorySectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  lightSubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8EE',
    borderWidth: 1,
    borderColor: '#DCDBE2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 6,
  },
  lightSubChipActive: {
    backgroundColor: '#090909',
    borderColor: '#090909',
  },
  lightSubChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#090909',
  },
  lightSubChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  expenseInputWrapper: {
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  expenseDescInput: {
    backgroundColor: '#E8E8EE',
    borderWidth: 1,
    borderColor: '#DCDBE2',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    color: '#090909',
  },
  keypad3ColContainer: {
    paddingHorizontal: 20,
    marginVertical: 8,
    gap: 8,
  },
  keypad3ColRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keypad3ColBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#E8E8EE',
    borderWidth: 1,
    borderColor: '#DCDBE2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypad3ColText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#090909',
  },
  saveExpenseBtn: {
    backgroundColor: '#090909',
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveExpenseBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  deleteBtnSquare: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // FLOATING PILL BOTTOM NAVIGATION
  floatingBottomNavWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingNavPill: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 999,
    padding: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#262626',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  navPillItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
  },
  navPillItemActive: {
    backgroundColor: '#FFFFFF',
  },
  // Screen Headers
  screenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  screenAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Budget Screen Elements
  darkCatSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
    paddingBottom: 14,
  },
  darkCatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  darkCatTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  darkCatSub: {
    fontSize: 10.5,
    color: '#8A8A8A',
    marginTop: 1,
  },
  darkAddSubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#292929',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 3,
  },
  darkAddSubBtnText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  darkSubName: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkSubLimit: {
    fontSize: 10.5,
    color: '#8A8A8A',
  },
  // Analytics
  monochromeBarChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrackArea: {
    width: 7,
    height: 90,
    backgroundColor: '#1F1F1F',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  barFillArea: {
    width: '100%',
    borderRadius: 4,
  },
  barFillAreaActive: {
    backgroundColor: '#FFFFFF',
  },
  barFillAreaInactive: {
    backgroundColor: '#666666',
  },
  barMonthText: {
    fontSize: 8.5,
    color: '#8A8A8A',
    marginTop: 4,
  },
  barMonthTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  greyBreakdownRow: {
    gap: 4,
  },
  greyBreakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greyBreakdownName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greyBreakdownVal: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  progressTrackLight: {
    height: 6,
    backgroundColor: '#242424',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFillBlack: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressFillMediumGrey: {
    height: '100%',
    backgroundColor: '#8A8A8A',
  },
  progressFillDarkGrey: {
    height: '100%',
    backgroundColor: '#D6D6D6',
  },
  // Settings
  darkActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#282828',
    padding: 16,
    borderRadius: 18,
  },
  darkActionCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkActionCardSub: {
    fontSize: 10.5,
    color: '#8A8A8A',
    marginTop: 2,
  },
  // Modals & Sheets
  modalBackdropBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBackdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalLightSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    maxHeight: '90%',
  },
  lightModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lightModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightModalSub: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 2,
  },
  lightSectionHeader: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
  },
  lightPresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  lightPresetPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
  },
  lightPresetPillActive: {
    backgroundColor: '#090909',
  },
  lightPresetPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#666666',
  },
  lightPresetPillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lightStepperCard: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  lightStepperName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightStepperAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightStepperSub: {
    fontSize: 10,
    color: '#8A8A8A',
    marginTop: 2,
  },
  lightStepperControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 4,
    marginTop: 8,
  },
  lightStepperCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightStepperPercentDigits: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightValidationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  lightValidationBalanced: {
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#D6D6D6',
  },
  lightValidationWarning: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  lightValidationText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightValidationAmount: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#090909',
  },
  lightTextInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 12,
    color: '#090909',
    fontSize: 12,
    marginBottom: 10,
  },
  // Month Picker
  monthPickerCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    gap: 6,
  },
  monthPickerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 1,
    marginBottom: 6,
  },
  monthItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  monthItemRowActive: {
    backgroundColor: '#F2F2F2',
  },
  monthItemText: {
    fontSize: 13,
    color: '#666666',
  },
  monthItemTextActive: {
    color: '#090909',
    fontWeight: 'bold',
  },
  // Onboarding
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#090909',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  onboardingLogoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  onboardingLogoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  onboardingSub: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D6D6D6',
    marginTop: 4,
  },
  onboardingDesc: {
    fontSize: 12,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  onboardingPrimaryBtn: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  onboardingPrimaryBtnText: {
    color: '#090909',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  onboardingBackBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingStepLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0A0A0',
    letterSpacing: 1.5,
  },
  onboardingStepTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 6,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  onboardingStepDesc: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
    lineHeight: 20,
  },
  incomeSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  incomeSourceInputName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  incomeSourceAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  incomeSourceInputAmount: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 4,
    minWidth: 70,
    textAlign: 'right',
  },
  incomeTotalBanner: {
    backgroundColor: '#141414',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 18,
    marginTop: 18,
  },
  allocCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 18,
    padding: 16,
  },
  allocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  allocAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  allocSub: {
    fontSize: 12.5,
    color: '#8A8A8A',
    marginTop: 6,
    lineHeight: 18,
  },
  allocSummaryBox: {
    backgroundColor: '#141414',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetChipSmall: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 12,
    alignItems: 'center',
  },
  presetChipSmallActive: {
    backgroundColor: '#FFFFFF',
  },
  presetChipSmallText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A8A8A',
  },
  presetChipSmallTextActive: {
    color: '#090909',
  },
  // SPLASH SCREEN (Atmospheric Minimal iOS Reference)
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    justifyContent: 'space-between',
  },
  splashTypographyContainer: {
    paddingHorizontal: 32,
    alignItems: 'flex-start',
    zIndex: 2,
  },
  splashMutedWord: {
    fontSize: 34,
    fontWeight: '400',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    lineHeight: 46,
  },
  splashBoldWord: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.5,
    lineHeight: 58,
    marginVertical: 2,
  },
  splashGradientWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '62%',
    zIndex: 1,
  },
  splashLowerContent: {
    paddingHorizontal: 28,
    zIndex: 3,
  },
  splashIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  splashHeadline: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  splashSubtext: {
    fontSize: 13.5,
    color: '#B3B3B3',
    lineHeight: 20,
    marginTop: 10,
    fontWeight: '400',
  },
  splashButtonsContainer: {
    marginTop: 26,
    gap: 10,
  },
  splashPrimaryBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  splashPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  splashSecondaryBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashSecondaryBtnText: {
    color: '#090909',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  // Step 4: Expense Categories Customizer
  catTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 16,
    padding: 5,
    marginTop: 14,
    gap: 6,
  },
  catTabBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 12,
  },
  catTabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  catTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#8A8A8A',
    textTransform: 'uppercase',
  },
  catTabTextActive: {
    color: '#090909',
  },
  catTabSubText: {
    fontSize: 11,
    color: '#666666',
    marginTop: 3,
    fontWeight: '700',
  },
  catTabSubTextActive: {
    color: '#333333',
  },
  setupPillarSummaryCard: {
    backgroundColor: '#141414',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 16,
    marginTop: 12,
  },
  setupSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  setupSubNameInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 4,
  },
  setupSubAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  setupSubAmountInput: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    minWidth: 65,
    textAlign: 'right',
    paddingVertical: 0,
    marginLeft: 3,
  },
  setupSubTrashBtn: {
    padding: 6,
  },
  addSubFormBox: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
  },
  // OVER-BUDGET WARNING STYLES
  overBudgetWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderWidth: 1.5,
    borderColor: '#3D3D3D',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  overBudgetWarningIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overBudgetWarningTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  overBudgetWarningDesc: {
    fontSize: 11.5,
    color: '#CCCCCC',
    marginTop: 3,
    lineHeight: 16,
  },
  overBudgetAlertCard: {
    borderWidth: 1.5,
    borderColor: '#333333',
    backgroundColor: '#121212',
  },
  overBudgetAlertRow: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#292929',
    padding: 12,
  },
  overBadgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  overBadgePillText: {
    color: '#090909',
    fontSize: 10.5,
    fontWeight: '900',
  },
  warningBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#383838',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  warningBadgeInlineText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  darkSubCardOverBudget: {
    borderColor: '#383838',
    backgroundColor: '#161616',
  },
  detailWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
  },
  detailWarningTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailWarningDesc: {
    fontSize: 11.5,
    color: '#B3B3B3',
    marginTop: 3,
    lineHeight: 16,
  },
  subDetailStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  subDetailStatBox: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  subDetailStatLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8A8A8A',
    letterSpacing: 0.5,
  },
  subDetailStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#090909',
    marginTop: 3,
  },
  subDetailTxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // BUDGET PLANNER REFERENCE LAYOUT STYLES
  budgetTopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  budgetScreenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  budgetNewPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },
  budgetNewPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  gaugeCardContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 6,
  },
  gaugeTopLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A7A7A',
    letterSpacing: 1.3,
    textAlign: 'center',
  },
  gaugeCenterTextOverlay: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeMainAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  gaugeSubLabel: {
    fontSize: 12.5,
    color: '#8A8A8A',
    marginTop: 2,
    fontWeight: '500',
  },
  gaugeBottomLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 210,
    marginTop: -4,
  },
  gaugeCornerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  budgetCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#202020',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetCardOverBudget: {
    borderColor: '#3D2020',
    backgroundColor: '#141010',
  },
  budgetCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  budgetIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  budgetTitleRow: {
    flex: 1,
    minWidth: 0,
  },
  budgetCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  budgetCardSubtitle: {
    fontSize: 12.5,
    color: '#888888',
    marginTop: 2,
  },
  budgetCardRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  budgetCardAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  budgetCardUnderText: {
    fontSize: 11.5,
    color: '#777777',
    marginTop: 2,
  },
  budgetCardOverText: {
    fontSize: 11.5,
    color: '#FF7070',
    marginTop: 2,
    fontWeight: '600',
  },
  budgetExpandedWrapper: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  budgetSubCard: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  budgetSubCardOverBudget: {
    borderColor: '#3E2020',
    backgroundColor: '#1A1212',
  },
  budgetSubActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  budgetSubActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  budgetSubActionBtnText: {
    color: '#A0A0A0',
    fontSize: 11.5,
    fontWeight: '600',
  },
  budgetPillarAdjustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  budgetPillarAdjustBtnText: {
    color: '#D6D6D6',
    fontSize: 11.5,
    fontWeight: '600',
  },
  // CALCULATOR STEP 1 STYLES
  calcHeroDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 8,
  },
  calcHeroCurrency: {
    fontSize: 34,
    fontWeight: '700',
    color: '#8A8A8A',
    marginRight: 6,
  },
  calcHeroAmount: {
    fontSize: 54,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  calcKeypadWrapperFilled: {
    gap: 10,
    width: '100%',
    paddingBottom: 4,
  },
  calcKeypadRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  calcKeypadBtnFilled: {
    flex: 1,
    height: 72,
    backgroundColor: '#141414',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcKeypadTextFilled: {
    fontSize: 27,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calcKeypadBtnTickActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  calcKeypadBtnTickDisabled: {
    backgroundColor: '#121212',
    borderColor: '#1E1E1E',
    opacity: 0.4,
  },
  // STEP 2 RATIO SLIDER STYLES
  ratioVisualizerContainer: {
    backgroundColor: '#141414',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#222222',
    padding: 14,
    marginBottom: 16,
  },
  ratioVisualizerBar: {
    height: 14,
    borderRadius: 7,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    gap: 3,
  },
  ratioVisualizerSeg: {
    height: '100%',
    borderRadius: 4,
  },
  ratioVisualizerLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  ratioLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratioLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratioLegendText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#A0A0A0',
  },
  ratioPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  ratioPillChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioPillChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  ratioPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#8A8A8A',
  },
  ratioPillTextActive: {
    color: '#090909',
    fontWeight: '800',
  },
  ratioSliderCard: {
    backgroundColor: '#141414',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
    padding: 16,
  },
  ratioSliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratioPillarDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  ratioSliderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratioSliderPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  ratioSliderAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  ratioSliderTrackContainer: {
    paddingVertical: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  ratioSliderTrackBg: {
    height: 10,
    backgroundColor: '#222222',
    borderRadius: 5,
    overflow: 'hidden',
  },
  ratioSliderTrackFill: {
    height: '100%',
    borderRadius: 5,
  },
  ratioSliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  centerAutoFixWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  centerAutoFixCta: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  centerAutoFixText: {
    color: '#090909',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  centerBalancedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  centerBalancedText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  onboardingNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  onboardingBackCircleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingContinueArrowBtn: {
    minWidth: 130,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  onboardingContinueArrowBtnDisabled: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#303030',
    shadowOpacity: 0,
    elevation: 0,
  },
  centerAddCategoryWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  centerAddCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  centerAddCategoryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  floatingAddExpenseFab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  pillarAllocationSummaryCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  pillarSummaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A8A8A',
    letterSpacing: 1,
  },
  pillarSummaryRemaining: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D6D6D6',
  },
  pillarProgressBarBg: {
    height: 7,
    backgroundColor: '#222222',
    borderRadius: 3.5,
    overflow: 'hidden',
    marginVertical: 6,
  },
  pillarProgressBarFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  // HOME 2-SLIDE & KEYPAD EXPENSE STYLES (GREY-NEAR-TO-BLACK SLEEK THEME)
  homeAmountCenterWrapper: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 6,
  },
  homeAmountEndToEndRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
  },
  homeCurrencyIsoCode: {
    fontSize: 36,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  homeAmountSplitTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  homeAmountBigInteger: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  homeAmountSmallFraction: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8E8E93',
    marginLeft: 2,
  },
  homeKeypadContainerCard: {
    backgroundColor: '#151518',
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 32,
    borderWidth: 1,
    borderColor: '#222228',
    position: 'relative',
  },
  homeTotalBalancePillBadge: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  homeTotalBalancePillLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  homeTotalBalancePillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  homeKeyTilesGrid: {
    gap: 10,
    marginTop: 4,
  },
  homeKeyTileRow: {
    flexDirection: 'row',
    gap: 10,
  },
  homeKeyTileBtn: {
    flex: 1,
    height: 72,
    backgroundColor: '#222227',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A30',
  },
  homeKeyTileNum: {
    fontSize: 30,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeKeyTileBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  homeKeyTileBtnIdle: {
    backgroundColor: '#222227',
  },
  homeCarouselDotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  carouselDot: {
    height: 6,
    borderRadius: 3,
  },
  carouselDotActive: {
    width: 22,
    backgroundColor: '#FFFFFF',
  },
  carouselDotInactive: {
    width: 6,
    backgroundColor: '#333333',
  },
  // DARK SLIDE-IN CATEGORIZE EXPENSE BOTTOM SHEET STYLES
  darkModalBackdropBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalDismissTouchable: {
    flex: 1,
  },
  darkSlideInCard: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHandleIndicatorDark: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    alignSelf: 'center',
    marginBottom: 12,
  },
  darkSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  darkSheetHeading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  darkSheetSubHeading: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 2,
  },
  darkCloseCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkGiantAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 10,
  },
  darkGiantAmountCurrency: {
    fontSize: 26,
    fontWeight: '700',
    color: '#8A8A8A',
    marginRight: 6,
  },
  darkGiantAmountDigits: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  darkCategoryPillSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 14,
  },
  darkCategorySegmentPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  darkCategorySegmentPillActive: {
    backgroundColor: '#FFFFFF',
  },
  darkCategorySegmentPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A8A8A',
  },
  darkCategorySegmentPillTextActive: {
    color: '#090909',
    fontWeight: '800',
  },
  darkSubcategoryChipsSection: {
    marginBottom: 14,
  },
  darkSubcategorySectionLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A8A8A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  darkSubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#282828',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  darkSubChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  darkSubChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  darkSubChipTextActive: {
    color: '#090909',
    fontWeight: '800',
  },
  darkOverBudgetWarningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#201212',
    borderWidth: 1,
    borderColor: '#401A1A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  darkOverBudgetWarningTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7575',
  },
  darkOverBudgetWarningDesc: {
    fontSize: 11,
    color: '#D0A0A0',
    marginTop: 2,
    lineHeight: 15,
  },
  darkExpenseInputWrapper: {
    marginBottom: 14,
  },
  darkExpenseDescInput: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#FFFFFF',
    fontSize: 13,
  },
  darkSaveExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 18,
    marginTop: 6,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  darkSaveExpenseBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090909',
  },
});
