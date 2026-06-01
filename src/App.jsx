import { useEffect, useMemo, useState } from 'react'
import {
  Home,
  PlusCircle,
  Settings,
  PieChart,
  Wallet,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Utensils,
  Coffee,
  Users,
  Dumbbell,
  House,
  Zap,
  Smartphone,
  ShoppingBag,
  Car,
  Gift,
  List,
  Heart,
  Music,
  BookOpen,
  Plane,
  Camera,
  Scissors,
  Laptop,
  Baby,
  Star,
  CircleDollarSign,
  Beer,
  Shirt,
  Train,
  Glasses,
  CreditCard,
  Hospital,
  FerrisWheel,
  Pill,
  Film,
  Gamepad2,
  Building2,
  Landmark,
  TrendingUp,
} from 'lucide-react'

const STORAGE_KEY = 'kakeibo-pwa-data'
const ACTIVE_TAB_KEY = 'kakeibo-pwa-active-tab'
const SCHEMA_VERSION = 1

const PunchIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 11.5v3c0 1.4-1.1 2.5-2.5 2.5S3 15.9 3 14.5v-2C3 11.1 4.1 10 5.5 10H8" />
    <path d="M8 10V6c0-1.7 1.3-3 3-3h4c2.8 0 5 2.2 5 5v5c0 3.3-2.7 6-6 6H8" />
    <path d="M8 19v-9" />
    <rect x="6" y="19" width="10" height="3" rx="1" />
  </svg>
)

const CATEGORIES = {
  food: {
    id: 'food',
    name: '食費',
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600',
    chartColor: '#f97316',
  },
  housing: {
    id: 'housing',
    name: '住居費',
    icon: House,
    color: 'bg-blue-100 text-blue-600',
    chartColor: '#2563eb',
  },
  utilities: {
    id: 'utilities',
    name: '光熱費',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    chartColor: '#ca8a04',
  },
  comm: {
    id: 'comm',
    name: '通信費',
    icon: Smartphone,
    color: 'bg-purple-100 text-purple-600',
    chartColor: '#9333ea',
  },
  shopping: {
    id: 'shopping',
    name: '日用品',
    icon: ShoppingBag,
    color: 'bg-green-100 text-green-600',
    chartColor: '#16a34a',
  },
  transport: {
    id: 'transport',
    name: '交通費',
    icon: Car,
    color: 'bg-teal-100 text-teal-600',
    chartColor: '#0d9488',
  },
  living: {
    id: 'living',
    name: '生活費',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600',
    chartColor: '#3b82f6',
  },
  investment: {
    id: 'investment',
    name: '投資',
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-600',
    chartColor: '#10b981',
  },
}

const AVAILABLE_ICONS = [
  { id: 'Utensils', icon: Utensils, label: '食事' },
  { id: 'Coffee', icon: Coffee, label: 'カフェ' },
  { id: 'ShoppingBag', icon: ShoppingBag, label: '買い物' },
  { id: 'Car', icon: Car, label: '交通' },
  { id: 'House', icon: House, label: '住居' },
  { id: 'Zap', icon: Zap, label: '光熱' },
  { id: 'Smartphone', icon: Smartphone, label: '通信' },
  { id: 'Gift', icon: Gift, label: '贈り物' },
  { id: 'Users', icon: Users, label: '家族' },
  { id: 'Dumbbell', icon: Dumbbell, label: 'ジム' },
  { id: 'Wallet', icon: Wallet, label: '財布' },
  { id: 'Heart', icon: Heart, label: '医療' },
  { id: 'Music', icon: Music, label: '音楽' },
  { id: 'BookOpen', icon: BookOpen, label: '書籍' },
  { id: 'Plane', icon: Plane, label: '旅行' },
  { id: 'Camera', icon: Camera, label: '趣味' },
  { id: 'Scissors', icon: Scissors, label: '美容' },
  { id: 'Laptop', icon: Laptop, label: 'PC' },
  { id: 'Baby', icon: Baby, label: '育児' },
  { id: 'Star', icon: Star, label: 'その他' },
  { id: 'PunchIcon', icon: PunchIcon, label: '格闘技' },
  { id: 'CircleDollarSign', icon: CircleDollarSign, label: 'お金' },
  { id: 'Beer', icon: Beer, label: '飲み会' },
  { id: 'Shirt', icon: Shirt, label: '洋服' },
  { id: 'Train', icon: Train, label: '電車' },
  { id: 'Glasses', icon: Glasses, label: '眼鏡' },
  { id: 'CreditCard', icon: CreditCard, label: 'カード' },
  { id: 'Hospital', icon: Hospital, label: '病院' },
  { id: 'FerrisWheel', icon: FerrisWheel, label: 'テーマパーク' },
  { id: 'Pill', icon: Pill, label: '薬局' },
  { id: 'Film', icon: Film, label: '映画' },
  { id: 'Gamepad2', icon: Gamepad2, label: 'ゲーム' },
  { id: 'Building2', icon: Building2, label: 'ビル' },
  { id: 'Landmark', icon: Landmark, label: '金融' },
  { id: 'TrendingUp', icon: TrendingUp, label: '投資' },
]

function resolveCat(categoryId, customCategories = [], categoryOverrides = {}) {
  if (CATEGORIES[categoryId]) {
    const base = CATEGORIES[categoryId]
    const override = categoryOverrides[categoryId]
    const icon = override?.iconId
      ? (AVAILABLE_ICONS.find((i) => i.id === override.iconId)?.icon || base.icon)
      : base.icon
    return { ...base, icon }
  }
  const custom = (customCategories || []).find((c) => c.id === categoryId)
  if (custom) {
    const icon = AVAILABLE_ICONS.find((i) => i.id === custom.iconId)?.icon || Wallet
    return {
      ...custom,
      icon,
      color: 'bg-indigo-100 text-indigo-600',
      chartColor: '#6366f1',
    }
  }
  return CATEGORIES.food
}

const initialData = {
  schemaVersion: SCHEMA_VERSION,
  monthlyBudget: 200000,
  transactions: [
    {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      title: 'スーパー',
      amount: 3480,
      category: 'food',
      isSpecial: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      title: '駅前カフェ',
      amount: 550,
      category: 'food',
      isSpecial: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      title: 'プレゼント',
      amount: 12000,
      category: 'shopping',
      isSpecial: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  fixedCosts: [
    {
      id: generateId(),
      name: '家賃',
      amount: 85000,
      category: 'housing',
      day: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'スマホ代',
      amount: 4500,
      category: 'comm',
      day: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '動画サブスク',
      amount: 1200,
      category: 'shopping',
      day: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  appSettings: {
    appName: '家計簿',
  },
  customCategories: [],
  monthlyGoals: {},
  fixedCostAdjustments: {},
  categoryOverrides: {},
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return initialData
    }

    const parsed = JSON.parse(raw)

    return {
      ...initialData,
      ...parsed,
      schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION,
      transactions: parsed.transactions ?? initialData.transactions,
      fixedCosts: parsed.fixedCosts ?? initialData.fixedCosts,
      monthlyBudget: parsed.monthlyBudget ?? initialData.monthlyBudget,
      appSettings: parsed.appSettings ?? initialData.appSettings,
      customCategories: parsed.customCategories ?? [],
      monthlyGoals: parsed.monthlyGoals ?? {},
      fixedCostAdjustments: parsed.fixedCostAdjustments ?? {},
      categoryOverrides: parsed.categoryOverrides ?? {},
    }
  } catch {
    return initialData
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat('ja-JP').format(Number(amount || 0)) + '円'
}

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

const EmptyCard = ({ title, text }) => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
    <p className="font-extrabold text-gray-600">{title}</p>
    <p className="mt-2 text-sm text-gray-400">{text}</p>
  </div>
)

const Modal = ({ children, onClose }) => (
  <div className="absolute inset-0 z-50 flex flex-col justify-end">
    <div
      className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 max-h-[86%] overflow-y-auto rounded-t-[36px] bg-white px-6 pb-8 pt-6 shadow-2xl animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200" />
      {children}
    </div>
  </div>
)

const FormInput = ({ label, value, onChange, placeholder, type = 'text', step }) => (
  <label className="mb-4 block">
    <span className="mb-2 block text-sm font-bold text-gray-600">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      step={step}
      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </label>
)

const CategorySelect = ({ value, onChange, disabled = false, categories }) => {
  const cats = categories || Object.values(CATEGORIES)
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-bold text-gray-600">カテゴリ</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
      >
        {cats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </label>
  )
}

const CategoryIcon = ({ categoryId, className = 'w-5 h-5', customCats = [], categoryOverrides = {} }) => {
  const Icon = resolveCat(categoryId, customCats, categoryOverrides).icon
  return <Icon className={className} />
}

const TransactionCard = ({ tx, onEdit, onDelete, customCats = [], showTotal = true, categoryOverrides = {} }) => {
  const cat = resolveCat(tx.category, customCats, categoryOverrides)
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className={`shrink-0 rounded-xl p-2.5 ${cat.color}`}>
          <CategoryIcon categoryId={tx.category} customCats={customCats} className="h-5 w-5" categoryOverrides={categoryOverrides} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-bold text-gray-800">{tx.title}</p>
          <p className="mt-0.5 text-xs text-gray-400">{tx.date}</p>
          <p className="truncate text-xs text-gray-400">{cat.name}</p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center">
        <div className="mr-4 text-right">
          {tx.isFixedDeposit ? (
            <span className="mb-1 inline-block whitespace-nowrap rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">
              固定費入金
            </span>
          ) : tx.isSpecial ? (
            <span className="mb-1 inline-block whitespace-nowrap rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
              固定支出
            </span>
          ) : null}
          <p className={`whitespace-nowrap font-extrabold ${tx.isFixedDeposit ? 'text-purple-600' : tx.isSpecial ? 'text-indigo-600' : 'text-gray-800'}`}>
            -{formatMoney(tx.amount)}
          </p>
          {tx.isSpecial && (tx.carryover ?? 0) > 0 && (
            <>
              <p className="mt-0.5 whitespace-nowrap text-xs text-indigo-400">前月残高 +{formatMoney(tx.carryover)}</p>
              {showTotal && (
                <p className="whitespace-nowrap text-xs font-bold text-indigo-500">合計 {formatMoney(tx.totalAvailable ?? (tx.amount + tx.carryover))}</p>
              )}
            </>
          )}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(tx)}
            className="rounded-xl bg-indigo-50 p-1.5 text-indigo-500"
            aria-label="編集"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(tx.id)}
            className="rounded-xl bg-red-50 p-1.5 text-red-500"
            aria-label="削除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
    const MIN_YEAR = 2026
  const MIN_MONTH = 5

  const clampDate = (date) => {
    const minDate = new Date(MIN_YEAR, MIN_MONTH - 1, 1)

    if (date < minDate) {
      return minDate
    }

    return date
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []

    for (let y = MIN_YEAR; y <= currentYear + 3; y++) {
      years.push(y)
    }

    return years
  }

  const getMonthOptions = (year) => {
    const startMonth = year === MIN_YEAR ? MIN_MONTH : 1

    return Array.from({ length: 12 - startMonth + 1 }, (_, i) => startMonth + i)
  }

  const MonthNavigator = ({ date, onChange, variant = 'light' }) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const isMinMonth = year === MIN_YEAR && month === MIN_MONTH

    const moveMonth = (diff) => {
      onChange(clampDate(new Date(year, date.getMonth() + diff, 1)))
    }

    const changeYear = (nextYear) => {
      const safeMonth =
        nextYear === MIN_YEAR && month < MIN_MONTH
          ? MIN_MONTH
          : month

      onChange(clampDate(new Date(nextYear, safeMonth - 1, 1)))
    }

    const changeMonth = (nextMonth) => {
      onChange(clampDate(new Date(year, nextMonth - 1, 1)))
    }

    const isDark = variant === 'dark'

    return (
      <div
        className={`mb-6 flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm ${
          isDark
            ? 'bg-white/15 text-white'
            : 'bg-white text-gray-700'
        }`}
      >
        <button
          onClick={() => moveMonth(-1)}
          disabled={isMinMonth}
          className={`rounded-full p-2 disabled:opacity-30 ${
            isDark
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => changeYear(Number(e.target.value))}
            className={`rounded-full px-3 py-2 text-sm font-extrabold outline-none ${
              isDark
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {getYearOptions().map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => changeMonth(Number(e.target.value))}
            className={`rounded-full px-3 py-2 text-sm font-extrabold outline-none ${
              isDark
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {getMonthOptions(year).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => moveMonth(1)}
          className={`rounded-full p-2 ${
            isDark
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    )
  }
  const getInitialTab = () => {
    try {
      const saved = localStorage.getItem(ACTIVE_TAB_KEY)
      const validTabs = ['home', 'fixed', 'transactions', 'reports', 'settings']
      if (saved && validTabs.includes(saved)) {
        return saved
      }
    } catch {
      // localStorage is not available
    }
    return 'home'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())
  const [data, setData] = useState(loadData)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showFixedModal, setShowFixedModal] = useState(false)
  const [editingFixedCost, setEditingFixedCost] = useState(null)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [viewDate, setViewDate] = useState(new Date())
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIconId, setNewCategoryIconId] = useState('Wallet')
  const [editingCustomCatId, setEditingCustomCatId] = useState(null)
  const [editCustomName, setEditCustomName] = useState('')
  const [editCustomIconId, setEditCustomIconId] = useState('Wallet')
  const [editingDefaultCatId, setEditingDefaultCatId] = useState(null)
  const [showActionPicker, setShowActionPicker] = useState(false)
  const [showFixedAddModal, setShowFixedAddModal] = useState(false)
  const [fixedAddForm, setFixedAddForm] = useState({ fixedCostId: '', amount: '' })
  const [editingFixedAmountInputs, setEditingFixedAmountInputs] = useState({})
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null)
  const [calendarDate, setCalendarDate] = useState(new Date())

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'food',
    isSpecial: false,
    carryover: '',
    date: todayString(),
  })

  const [fixedForm, setFixedForm] = useState({
    name: '',
    amount: '',
    category: 'housing',
    day: '1',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, activeTab)
    } catch {
      // localStorage is not available
    }
  }, [activeTab])

  const currentMonthKey = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`

  const prevMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`

  const monthlyTransactions = useMemo(() => {
    return data.transactions.filter((tx) => tx.date?.startsWith(currentMonthKey))
  }, [data.transactions, currentMonthKey])

  const variableExpenseTotal = useMemo(() => {
    return monthlyTransactions
      .filter((tx) => !tx.isFixedDeposit)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
  }, [monthlyTransactions])

  const fixedTotal = useMemo(() => {
    return data.fixedCosts.reduce((sum, cost) => {
      const adj = data.fixedCostAdjustments?.[currentMonthKey]?.[cost.id]
      const amount = adj?.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
      return sum + amount
    }, 0)
  }, [data.fixedCosts, data.fixedCostAdjustments, currentMonthKey])

  const totalExpense = variableExpenseTotal + fixedTotal

  const prevMonthTransactions = useMemo(() => {
    return data.transactions.filter((tx) => tx.date?.startsWith(prevMonthKey))
  }, [data.transactions, prevMonthKey])

  const prevVariableExpenseTotal = useMemo(() => {
    return prevMonthTransactions
      .filter((tx) => !tx.isFixedDeposit)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
  }, [prevMonthTransactions])

  const prevFixedTotal = useMemo(() => {
    return data.fixedCosts.reduce((sum, cost) => {
      const adj = data.fixedCostAdjustments?.[prevMonthKey]?.[cost.id]
      const amount = adj?.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
      return sum + amount
    }, 0)
  }, [data.fixedCosts, data.fixedCostAdjustments, prevMonthKey])

  const prevMonthExpense = prevVariableExpenseTotal + prevFixedTotal

  const variableTransactions = useMemo(() => {
    return monthlyTransactions.filter((tx) => !tx.isFixedDeposit)
  }, [monthlyTransactions])

  const dailyExpenseMap = useMemo(() => {
    const map = {}
    variableTransactions.forEach((tx) => {
      if (tx.date) {
        map[tx.date] = (map[tx.date] || 0) + Number(tx.amount || 0)
      }
    })
    return map
  }, [variableTransactions])

  const calendarMonthKey = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}`

  const calendarTransactions = useMemo(() => {
    return data.transactions.filter((tx) => tx.date?.startsWith(calendarMonthKey) && !tx.isFixedDeposit)
  }, [data.transactions, calendarMonthKey])

  const calendarDailyExpenseMap = useMemo(() => {
    const map = {}
    calendarTransactions.forEach((tx) => {
      if (tx.date) {
        map[tx.date] = (map[tx.date] || 0) + Number(tx.amount || 0)
      }
    })
    return map
  }, [calendarTransactions])

  const hasPrevMonthData = useMemo(() => {
    return data.transactions.some((tx) => tx.date?.startsWith(prevMonthKey))
  }, [data.transactions, prevMonthKey])

  const allCategories = useMemo(
    () => [
      ...Object.values(CATEGORIES).map((c) => {
        const override = data.categoryOverrides?.[c.id]
        const icon = override?.iconId
          ? (AVAILABLE_ICONS.find((i) => i.id === override.iconId)?.icon || c.icon)
          : c.icon
        return { ...c, icon }
      }),
      ...(data.customCategories || []).map((c) => ({
        ...c,
        icon: AVAILABLE_ICONS.find((i) => i.id === c.iconId)?.icon || Wallet,
        color: 'bg-indigo-100 text-indigo-600',
        chartColor: '#6366f1',
      })),
    ],
    [data.customCategories, data.categoryOverrides]
  )

  const remaining = data.monthlyBudget - totalExpense
  const progressPercent = Math.min((totalExpense / data.monthlyBudget) * 100, 100)

  const categoryReport = useMemo(() => {
    const map = {}

    monthlyTransactions
      .filter((tx) => !tx.isFixedDeposit)
      .forEach((tx) => {
        const key = tx.category || 'food'
        map[key] = (map[key] || 0) + Number(tx.amount || 0)
      })

    // 固定費を加算
    data.fixedCosts.forEach((cost) => {
      const adj = data.fixedCostAdjustments?.[currentMonthKey]?.[cost.id]
      const amount = adj?.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
      const key = cost.category || 'food'
      map[key] = (map[key] || 0) + amount
    })

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthlyTransactions, data.fixedCosts, data.fixedCostAdjustments, currentMonthKey, totalExpense])

  const donutGradient = useMemo(() => {
    if (!categoryReport.length) return '#e5e7eb 0% 100%'

    let start = 0

    return categoryReport
      .map((item) => {
        const end = start + item.percent
        const color = resolveCat(item.category, data.customCategories, data.categoryOverrides).chartColor
        const part = `${color} ${start}% ${end}%`
        start = end
        return part
      })
      .join(', ')
  }, [categoryReport, data.customCategories])

  const openAddExpense = (isSpecial = false) => {
    setEditingTransaction(null)
    setShowAddCategoryForm(false)
    setNewCategoryName('')
    setNewCategoryIconId('Wallet')
    setExpenseForm({
      title: '',
      amount: '',
      category: 'food',
      isSpecial,
      carryover: '',
      date: todayString(),
    })
    setShowExpenseModal(true)
  }

  const openEditTransaction = (tx) => {
    setEditingTransaction(tx)
    setShowAddCategoryForm(false)
    setNewCategoryName('')
    setNewCategoryIconId('Wallet')
    setExpenseForm({
      title: tx.title,
      amount: String(tx.amount),
      category: tx.category,
      isSpecial: tx.isSpecial,
      carryover: tx.carryover ? String(tx.carryover) : '',
      date: tx.date,
    })
    setShowExpenseModal(true)
  }

  const saveExpense = () => {
    const amount = Number(expenseForm.amount)

    if (!expenseForm.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      alert('タイトルと金額を入力してください')
      return
    }

    const title = expenseForm.title.trim()
    const now = new Date().toISOString()

    if (editingTransaction) {
      const newAmount = Math.round(amount)
      const isFixedDeposit = !!editingTransaction.isFixedDeposit
      const fixedCostId = editingTransaction.fixedCostId

      setData((prev) => {
        const updatedTransactions = prev.transactions.map((tx) =>
          tx.id === editingTransaction.id
            ? {
                ...tx,
                title,
                amount: newAmount,
                carryover: isFixedDeposit ? (tx.carryover ?? 0) : 0,
                totalAvailable: newAmount + (isFixedDeposit ? (tx.carryover ?? 0) : 0),
                category: expenseForm.category,
                isSpecial: isFixedDeposit ? true : false,
                date: expenseForm.date,
                updatedAt: now,
              }
            : tx
        )

        if (!isFixedDeposit || !fixedCostId) {
          return { ...prev, transactions: updatedTransactions }
        }

        const monthKey = editingTransaction.date.slice(0, 7)
        const diff = newAmount - Number(editingTransaction.amount)
        const adj = prev.fixedCostAdjustments?.[monthKey]?.[fixedCostId] || {}
        const cost = prev.fixedCosts.find((c) => c.id === fixedCostId)
        const currentAdj = adj.amount !== undefined ? Number(adj.amount) : Number(cost?.amount || 0)
        const currentCarryover = Number(adj.carryover || 0)
        const nextAmount = Math.max(0, currentAdj + diff)

        return {
          ...prev,
          transactions: updatedTransactions,
          fixedCostAdjustments: {
            ...(prev.fixedCostAdjustments || {}),
            [monthKey]: {
              ...(prev.fixedCostAdjustments?.[monthKey] || {}),
              [fixedCostId]: {
                ...adj,
                amount: nextAmount,
                carryover: currentCarryover,
                totalAvailable: nextAmount + currentCarryover,
              },
            },
          },
        }
      })
    } else {
      const newTx = {
        id: generateId(),
        title,
        amount: Math.round(amount),
        carryover: 0,
        totalAvailable: Math.round(amount),
        category: expenseForm.category,
        isSpecial: false,
        date: expenseForm.date,
        createdAt: now,
        updatedAt: now,
      }

      setData((prev) => ({
        ...prev,
        transactions: [newTx, ...prev.transactions],
      }))
    }

    setShowExpenseModal(false)
  }

  const deleteTransaction = (id) => {
    if (!confirm('この支出を削除しますか？')) return

    setData((prev) => {
      const tx = prev.transactions.find((t) => t.id === id)

      if (!tx?.isFixedDeposit || !tx.fixedCostId) {
        return {
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== id),
        }
      }

      const monthKey = tx.date.slice(0, 7)
      const fixedCostId = tx.fixedCostId
      const adj = prev.fixedCostAdjustments?.[monthKey]?.[fixedCostId] || {}
      const cost = prev.fixedCosts.find((c) => c.id === fixedCostId)
      const currentAmount = adj.amount !== undefined ? Number(adj.amount) : Number(cost?.amount || 0)
      const currentCarryover = Number(adj.carryover || 0)
      const nextAmount = Math.max(0, currentAmount - Number(tx.amount))

      return {
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
        fixedCostAdjustments: {
          ...(prev.fixedCostAdjustments || {}),
          [monthKey]: {
            ...(prev.fixedCostAdjustments?.[monthKey] || {}),
            [fixedCostId]: {
              ...adj,
              amount: nextAmount,
              carryover: currentCarryover,
              totalAvailable: nextAmount + currentCarryover,
            },
          },
        },
      }
    })
  }

  const openAddFixedCost = () => {
    setEditingFixedCost(null)
    setFixedForm({
      name: '',
      amount: '',
      category: 'housing',
      day: '1',
    })
    setShowFixedModal(true)
  }

  const openEditFixedCost = (cost) => {
    setEditingFixedCost(cost)
    setFixedForm({
      name: cost.name,
      amount: String(cost.amount),
      category: cost.category,
      day: String(cost.day),
    })
    setShowFixedModal(true)
  }

  const saveFixedCost = () => {
    const amount = Number(fixedForm.amount)
    const day = Number(fixedForm.day)

    if (
      !fixedForm.name.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isFinite(day) ||
      day < 1 ||
      day > 31
    ) {
      alert('固定費名、金額、日付を正しく入力してください')
      return
    }

    if (editingFixedCost) {
      setData((prev) => ({
        ...prev,
        fixedCosts: prev.fixedCosts.map((cost) =>
          cost.id === editingFixedCost.id
            ? {
                ...cost,
                name: fixedForm.name.trim(),
                amount: Math.round(amount),
                category: fixedForm.category,
                day: Math.round(day),
                updatedAt: new Date().toISOString(),
              }
            : cost
        ),
      }))
    } else {
      const next = {
        id: generateId(),
        name: fixedForm.name.trim(),
        amount: Math.round(amount),
        category: fixedForm.category,
        day: Math.round(day),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setData((prev) => ({
        ...prev,
        fixedCosts: [...prev.fixedCosts, next],
      }))
    }

    setShowFixedModal(false)
  }

  const deleteFixedCost = (id) => {
    if (!confirm('この固定費を削除しますか？')) return

    setData((prev) => ({
      ...prev,
      fixedCosts: prev.fixedCosts.filter((cost) => cost.id !== id),
    }))
  }

  const moveFixedCost = (index, direction) => {
    setData((prev) => {
      const next = [...prev.fixedCosts]
      const target = index + direction

      if (target < 0 || target >= next.length) return prev

      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)

      return {
        ...prev,
        fixedCosts: next,
      }
    })
  }



  const saveFixedAdd = () => {
    const amount = Number(fixedAddForm.amount)
    if (!fixedAddForm.fixedCostId || !Number.isFinite(amount) || amount <= 0) {
      alert('固定費と金額を入力してください')
      return
    }
    const cost = data.fixedCosts.find((c) => c.id === fixedAddForm.fixedCostId)
    if (!cost) return
    const now = new Date().toISOString()
    const newTx = {
      id: generateId(),
      title: cost.name,
      amount: Math.round(amount),
      category: cost.category,
      isSpecial: true,
      isFixedDeposit: true,
      fixedCostId: cost.id,
      date: todayString(),
      createdAt: now,
      updatedAt: now,
    }
    setData((prev) => {
      const adj = prev.fixedCostAdjustments?.[currentMonthKey]?.[cost.id] || {}
      const currentAmount = adj.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
      const currentCarryover = Number(adj.carryover || 0)
      const nextAmount = currentAmount + amount
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        fixedCostAdjustments: {
          ...(prev.fixedCostAdjustments || {}),
          [currentMonthKey]: {
            ...(prev.fixedCostAdjustments?.[currentMonthKey] || {}),
            [cost.id]: {
              ...adj,
              amount: nextAmount,
              carryover: currentCarryover,
              totalAvailable: nextAmount + currentCarryover,
            },
          },
        },
      }
    })
    setShowFixedAddModal(false)
    setFixedAddForm({ fixedCostId: '', amount: '' })
  }

  const addCustomCategory = (formType = 'expense') => {
    const name = newCategoryName.trim()
    if (!name) return
    const allNames = [
      ...Object.values(CATEGORIES).map((c) => c.name),
      ...(data.customCategories || []).map((c) => c.name),
    ]
    if (allNames.includes(name)) {
      alert('同じ名前のカテゴリが既に存在します')
      return
    }
    const id = `custom-${generateId()}`
    setData((prev) => ({
      ...prev,
      customCategories: [...(prev.customCategories || []), { id, name, iconId: newCategoryIconId }],
    }))
    if (formType === 'fixed') {
      setFixedForm((prev) => ({ ...prev, category: id }))
    } else {
      setExpenseForm((prev) => ({ ...prev, category: id }))
    }
    setNewCategoryName('')
    setShowAddCategoryForm(false)
  }

  const updateCustomCategory = () => {
    const name = editCustomName.trim()
    if (!name) return
    const allNames = [
      ...Object.values(CATEGORIES).map((c) => c.name),
      ...(data.customCategories || [])
        .filter((c) => c.id !== editingCustomCatId)
        .map((c) => c.name),
    ]
    if (allNames.includes(name)) {
      alert('同じ名前のカテゴリが既に存在します')
      return
    }
    setData((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).map((c) =>
        c.id === editingCustomCatId ? { ...c, name, iconId: editCustomIconId } : c
      ),
    }))
    setEditingCustomCatId(null)
  }

  const deleteCustomCategory = (id) => {
    if (!confirm('このカテゴリを削除しますか？\n使用中の支出・固定費は「食費」に変更されます。')) return
    setData((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).filter((c) => c.id !== id),
      transactions: prev.transactions.map((tx) =>
        tx.category === id ? { ...tx, category: 'food' } : tx
      ),
      fixedCosts: prev.fixedCosts.map((cost) =>
        cost.category === id ? { ...cost, category: 'food' } : cost
      ),
    }))
    if (editingCustomCatId === id) setEditingCustomCatId(null)
  }

  const homeTab = () => (
    <div>
      <div className="rounded-b-[36px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 pb-8 pt-10 text-white shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            className="rounded-full bg-white/20 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="text-sm text-indigo-100">
              {viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月
            </p>
            <h1 className="text-2xl font-extrabold">支出状況</h1>
          </div>

          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            className="rounded-full bg-white/20 p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/15 p-6 shadow-inner backdrop-blur">
          <p className="text-sm text-indigo-100">今月の合計支出</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight">
            {formatMoney(totalExpense)}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span className="text-indigo-100">予算残額</span>
              <span>{formatMoney(remaining)}</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-2 text-right text-xs text-indigo-100">
              予算 {formatMoney(data.monthlyBudget)}
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-6 flex gap-4 px-6">
        <div className={`flex-1 rounded-3xl border border-gray-100 p-4 shadow-lg ${
          hasPrevMonthData && totalExpense > prevMonthExpense
            ? 'bg-gradient-to-br from-red-50 to-pink-50'
            : hasPrevMonthData && totalExpense < prevMonthExpense
            ? 'bg-gradient-to-br from-indigo-50 to-blue-50'
            : 'bg-white'
        }`}>
          <p className="text-xs font-bold tracking-wide text-gray-400">前月比</p>
          {hasPrevMonthData ? (
            <>
              <p className={`mt-1.5 text-base font-extrabold leading-tight ${
                totalExpense > prevMonthExpense ? 'text-red-500' : totalExpense < prevMonthExpense ? 'text-indigo-500' : 'text-gray-500'
              }`}>
                {totalExpense === prevMonthExpense
                  ? '±0円'
                  : `${totalExpense > prevMonthExpense ? '+' : '−'}${formatMoney(Math.abs(totalExpense - prevMonthExpense))}`
                }
              </p>
              <p className="mt-1 text-xs text-gray-400">先月 {formatMoney(prevMonthExpense)}</p>
            </>
          ) : (
            <p className="mt-2 text-xs text-gray-400">前月データなし</p>
          )}
        </div>

        <div className="flex-1 rounded-3xl border border-gray-100 bg-white p-3 shadow-lg">
          <p className="mb-1.5 text-xs font-bold tracking-wide text-gray-400">今月の目標</p>
          <textarea
            value={data.monthlyGoals?.[currentMonthKey] || ''}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                monthlyGoals: { ...(prev.monthlyGoals || {}), [currentMonthKey]: e.target.value },
              }))
            }
            placeholder="今月の目標を入力"
            className="w-full resize-none rounded-2xl border border-gray-100 bg-indigo-50/40 px-2 py-2 text-xs font-normal text-gray-700 outline-none placeholder:text-xs placeholder:font-normal placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-400"
            style={{
              minHeight: '64px',
              lineHeight: '1.4',
            }}
          />
        </div>
      </div>

      <div className="mt-8 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-800">最近の記録</h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-sm font-bold text-indigo-500"
          >
            すべて見る
          </button>
        </div>

        <div className="space-y-3">
          {data.transactions.slice(0, 5).length ? (
            data.transactions.slice(0, 5).map((tx) => (
              <TransactionCard key={tx.id} tx={tx} onEdit={openEditTransaction} onDelete={deleteTransaction} customCats={data.customCategories} showTotal={false} categoryOverrides={data.categoryOverrides} />
            ))
          ) : (
            <EmptyCard title="記録がありません" text="＋ボタンから支出を登録しましょう" />
          )}
        </div>
      </div>
    </div>
  )

  const fixedTab = () => (
    <div className="px-6 pt-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">固定費</h1>
          <p className="mt-1 text-xs text-gray-400">毎月の支出を管理します</p>
        </div>

        <button
          onClick={openAddFixedCost}
          className="rounded-full bg-indigo-500 p-3 text-white shadow-lg shadow-indigo-500/30"
        >
          <PlusCircle className="h-6 w-6" />
        </button>
      </div>

      <MonthNavigator date={viewDate} onChange={setViewDate} />

      <div className="mb-6 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-bold text-gray-400">今月の固定費入金合計</p>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600">
          {formatMoney(fixedTotal)}
        </p>
        {(() => {
          const baseTotal = data.fixedCosts.reduce((sum, cost) => sum + Number(cost.amount || 0), 0)
          return baseTotal !== fixedTotal ? (
            <p className="mt-1 text-xs text-gray-400">基本固定費合計 {formatMoney(baseTotal)}</p>
          ) : null
        })()}
      </div>

      <div className="space-y-3">
        {data.fixedCosts.length ? (
          data.fixedCosts.map((cost, index) => (
            <div key={cost.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {(() => {
                const adj = data.fixedCostAdjustments?.[currentMonthKey]?.[cost.id]
                const amount = adj?.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
                const carryover = Number(adj?.carryover || 0)
                const totalAvailable = amount + carryover
                const updateAdj = (fields) => {
                  setData((prev) => {
                    const prevAdj = prev.fixedCostAdjustments?.[currentMonthKey]?.[cost.id] || {}
                    const newAdj = { ...prevAdj, ...fields }
                    const newAmount = newAdj.amount !== undefined ? Number(newAdj.amount) : Number(cost.amount || 0)
                    const newCarryover = Number(newAdj.carryover || 0)
                    return {
                      ...prev,
                      fixedCostAdjustments: {
                        ...(prev.fixedCostAdjustments || {}),
                        [currentMonthKey]: {
                          ...(prev.fixedCostAdjustments?.[currentMonthKey] || {}),
                          [cost.id]: {
                            ...newAdj,
                            totalAvailable: newAmount + newCarryover,
                          },
                        },
                      },
                    }
                  })
                }
                return (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`rounded-xl p-3 ${resolveCat(cost.category, data.customCategories, data.categoryOverrides).color}`}>
                          <CategoryIcon categoryId={cost.category} customCats={data.customCategories} className="h-5 w-5" categoryOverrides={data.categoryOverrides} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-extrabold text-gray-800">{cost.name}</p>
                          <p className="mt-1 text-xs text-gray-400">毎月 {cost.day} 日</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">合計</p>
                        <p className="whitespace-nowrap text-lg font-extrabold text-indigo-600">
                          {formatMoney(totalAvailable)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {(() => {
                        const amountInputKey = `${cost.id}-amount`
                        const isEditingAmount = Object.prototype.hasOwnProperty.call(editingFixedAmountInputs, amountInputKey)
                        const carryoverInputKey = `${cost.id}-carryover`
                        const isEditingCarryover = Object.prototype.hasOwnProperty.call(editingFixedAmountInputs, carryoverInputKey)

                        return (
                          <>
                            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                              <p className="w-16 shrink-0 text-xs text-gray-400">今月入金</p>
                              <input
                                type="number"
                                min="0"
                                step={1000}
                                placeholder={String(cost.amount || 0)}
                                value={isEditingAmount ? editingFixedAmountInputs[amountInputKey] : (adj?.amount !== undefined ? adj.amount : '')}
                                onChange={(e) => {
                                  const nextValue = e.target.value.replace(/[^\d]/g, '')
                                  setEditingFixedAmountInputs((prev) => ({
                                    ...prev,
                                    [amountInputKey]: nextValue,
                                  }))
                                }}
                                onFocus={() => {
                                  setEditingFixedAmountInputs((prev) => ({
                                    ...prev,
                                    [amountInputKey]: '',
                                  }))
                                }}
                                onBlur={() => {
                                  const inputValue = editingFixedAmountInputs[amountInputKey]
                                  if (inputValue !== undefined && inputValue !== '') {
                                    const numVal = Number(inputValue)
                                    if (Number.isFinite(numVal) && numVal >= 0) {
                                      updateAdj({ amount: numVal })
                                    }
                                  }
                                  setEditingFixedAmountInputs((prev) => {
                                    const next = { ...prev }
                                    delete next[amountInputKey]
                                    return next
                                  })
                                }}
                                className="w-full bg-transparent text-right text-xs font-bold text-gray-700 outline-none placeholder:text-gray-400"
                              />
                              <p className="shrink-0 text-xs text-gray-400">円</p>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                              <p className="w-16 shrink-0 text-xs text-gray-400">前月残高</p>
                              <span className="shrink-0 text-xs font-bold text-indigo-400">+</span>
                              <input
                                type="number"
                                min="0"
                                step={1000}
                                placeholder="0"
                                value={isEditingCarryover ? editingFixedAmountInputs[carryoverInputKey] : (adj?.carryover || '')}
                                onChange={(e) => {
                                  const nextValue = e.target.value.replace(/[^\d]/g, '')
                                  setEditingFixedAmountInputs((prev) => ({
                                    ...prev,
                                    [carryoverInputKey]: nextValue,
                                  }))
                                }}
                                onFocus={() => {
                                  setEditingFixedAmountInputs((prev) => ({
                                    ...prev,
                                    [carryoverInputKey]: '',
                                  }))
                                }}
                                onBlur={() => {
                                  const inputValue = editingFixedAmountInputs[carryoverInputKey]
                                  if (inputValue !== undefined && inputValue !== '') {
                                    const numVal = Number(inputValue)
                                    if (Number.isFinite(numVal) && numVal >= 0) {
                                      updateAdj({ carryover: numVal })
                                    }
                                  }
                                  setEditingFixedAmountInputs((prev) => {
                                    const next = { ...prev }
                                    delete next[carryoverInputKey]
                                    return next
                                  })
                                }}
                                className="w-full bg-transparent text-right text-xs font-bold text-gray-700 outline-none placeholder:text-gray-300"
                              />
                              <p className="shrink-0 text-xs text-gray-400">円</p>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </>
                )
              })()}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => moveFixedCost(index, -1)}
                  className="flex-1 rounded-xl bg-gray-50 py-2 text-gray-500 disabled:opacity-30"
                  disabled={index === 0}
                >
                  <ArrowUp className="mx-auto h-4 w-4" />
                </button>

                <button
                  onClick={() => moveFixedCost(index, 1)}
                  className="flex-1 rounded-xl bg-gray-50 py-2 text-gray-500 disabled:opacity-30"
                  disabled={index === data.fixedCosts.length - 1}
                >
                  <ArrowDown className="mx-auto h-4 w-4" />
                </button>

                <button
                  onClick={() => openEditFixedCost(cost)}
                  className="flex-1 rounded-xl bg-indigo-50 py-2 text-indigo-500"
                >
                  <Pencil className="mx-auto h-4 w-4" />
                </button>

                <button
                  onClick={() => deleteFixedCost(cost.id)}
                  className="flex-1 rounded-xl bg-red-50 py-2 text-red-500"
                >
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyCard title="固定費がありません" text="右上の＋から登録できます" />
        )}
      </div>
    </div>
  )

  const transactionsTab = () => {
  const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate()

  return (
    <div className="px-6 pt-10">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-800">カレンダー</h1>

      <div className="rounded-3xl bg-white p-6 shadow-sm mb-6">
        <MonthNavigator
  date={calendarDate}
  onChange={(nextDate) => {
    setCalendarDate(nextDate)
    setSelectedCalendarDate(null)
  }}
/>

        <p className="mb-4 text-center text-sm font-bold text-gray-400">支出カレンダー</p>

        <div className="mb-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500">
          {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const dateStr = `${calendarMonthKey}-${String(day).padStart(2, '0')}`
            const amount = calendarDailyExpenseMap[dateStr] || 0
            const isSelected = selectedCalendarDate === dateStr

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedCalendarDate(dateStr)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl p-2 text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="font-bold">{day}</span>

                {amount > 0 && (
                  <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-indigo-600'}`}>
                    ¥{amount.toLocaleString()}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {selectedCalendarDate && (() => {
          const dayTransactions = calendarTransactions.filter((tx) => tx.date === selectedCalendarDate)
          const [, month, day] = selectedCalendarDate.split('-')

          return (
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-bold text-gray-500">
                {parseInt(month)}月{parseInt(day)}日の支出
              </p>

              {dayTransactions.length ? (
                <div className="space-y-2">
                  {dayTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{tx.title}</span>

                      <span className="font-bold text-gray-800">
                        ¥{tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">この日は支出がありません</p>
              )}
            </div>
          )
        })()}
      </div>

      <h2 className="mb-4 text-lg font-extrabold text-gray-800">すべての記録</h2>

      <div className="space-y-3">
        {data.transactions.length ? (
          data.transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              onEdit={openEditTransaction}
              onDelete={deleteTransaction}
              customCats={data.customCategories}
              categoryOverrides={data.categoryOverrides}
            />
          ))
        ) : (
          <EmptyCard title="支出がありません" text="＋ボタンから登録できます" />
        )}
      </div>
    </div>
  )
}

  const reportsTab = () => (
  <div className="px-6 pt-10">
    <h1 className="mb-6 text-2xl font-extrabold text-gray-800">レポート</h1>

    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="mb-6 text-center text-sm font-bold text-gray-400">
        カテゴリ別支出
      </p>

      <div
        className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-full shadow-inner"
        style={{ background: `conic-gradient(${donutGradient})` }}
      >
        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-sm">
          <p className="text-xs font-bold text-gray-400">合計</p>

          <p className="text-lg font-extrabold text-gray-800">
            {formatMoney(totalExpense)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categoryReport.length ? (
          categoryReport.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background:
                      resolveCat(
                        item.category,
                        data.customCategories,
                        data.categoryOverrides
                      ).chartColor,
                  }}
                />

                <span className="text-sm font-bold text-gray-700">
                  {
                    resolveCat(
                      item.category,
                      data.customCategories,
                      data.categoryOverrides
                    ).name
                  }
                </span>
              </div>

              <div className="text-right">
                <p className="text-sm font-extrabold text-gray-800">
                  {formatMoney(item.amount)}
                </p>

                <p className="text-xs text-gray-400">
                  {item.percent}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400">
            今月の支出データがありません
          </p>
        )}
      </div>
    </div>
  </div>
)
  

  const settingsTab = () => (
    <div className="px-6 pt-10">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-800">設定</h1>

      <div className="mb-4 rounded-3xl bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-bold text-gray-600">月予算</label>
        <input
          type="number"
          step={1000}
          value={data.monthlyBudget}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              monthlyBudget: Number(e.target.value),
            }))
          }
          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-800">カスタムカテゴリ</h2>
          <span className="text-xs font-bold text-gray-400">{(data.customCategories || []).length} / 20</span>
        </div>
        {(data.customCategories || []).length === 0 ? (
          <p className="text-sm text-gray-400">追加したカテゴリはありません</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {(data.customCategories || []).map((cat) => {
              const isEditing = editingCustomCatId === cat.id
              const CatIcon = AVAILABLE_ICONS.find((i) => i.id === cat.iconId)?.icon || Wallet
              return (
                <div key={cat.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editCustomName}
                        onChange={(e) => setEditCustomName(e.target.value)}
                        className="mb-3 w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="mb-1.5 text-xs font-bold text-gray-500">アイコンを選択</p>
                      <div className="mb-3 grid grid-cols-7 gap-1.5">
                        {AVAILABLE_ICONS.map((item) => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setEditCustomIconId(item.id)}
                              title={item.label}
                              className={`flex aspect-square items-center justify-center rounded-xl ${
                                editCustomIconId === item.id
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-white text-gray-500'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={updateCustomCategory}
                          className="flex-1 rounded-xl bg-indigo-500 py-2 text-sm font-bold text-white"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingCustomCatId(null)}
                          className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-bold text-gray-600"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                        <CatIcon className="h-5 w-5" />
                      </div>
                      <span className="flex-1 font-bold text-gray-800">{cat.name}</span>
                      <button
                        onClick={() => {
                          setEditingCustomCatId(cat.id)
                          setEditCustomName(cat.name)
                          setEditCustomIconId(cat.iconId || 'Wallet')
                        }}
                        className="rounded-xl bg-indigo-50 p-2 text-indigo-500"
                        aria-label="編集"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomCategory(cat.id)}
                        className="rounded-xl bg-red-50 p-2 text-red-500"
                        aria-label="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-extrabold text-gray-800">デフォルトカテゴリ管理</h2>
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {Object.values(CATEGORIES).map((cat) => {
            const override = data.categoryOverrides?.[cat.id]
            const CurrentIcon = override?.iconId
              ? (AVAILABLE_ICONS.find((i) => i.id === override.iconId)?.icon || cat.icon)
              : cat.icon
            const isEditing = editingDefaultCatId === cat.id
            return (
              <div key={cat.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                {isEditing ? (
                  <div>
                    <p className="mb-1.5 text-xs font-bold text-gray-500">アイコンを選択（{cat.name}）</p>
                    <div className="mb-3 grid grid-cols-7 gap-1.5">
                      {AVAILABLE_ICONS.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                categoryOverrides: {
                                  ...(prev.categoryOverrides || {}),
                                  [cat.id]: { ...(prev.categoryOverrides?.[cat.id] || {}), iconId: item.id },
                                },
                              }))
                              setEditingDefaultCatId(null)
                            }}
                            title={item.label}
                            className={`flex aspect-square items-center justify-center rounded-xl ${
                              (override?.iconId || '') === item.id
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white text-gray-500'
                            }`}
                          >
                            <ItemIcon className="h-5 w-5" />
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setEditingDefaultCatId(null)}
                      className="w-full rounded-xl bg-gray-100 py-2 text-sm font-bold text-gray-600"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${cat.color}`}>
                      <CurrentIcon className="h-5 w-5" />
                    </div>
                    <span className="flex-1 font-bold text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => setEditingDefaultCatId(cat.id)}
                      className="rounded-xl bg-indigo-50 p-2 text-indigo-500"
                      aria-label="アイコン変更"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-extrabold text-gray-800">プライバシー</h2>
        <p className="text-sm leading-6 text-gray-500">
          データはこの端末内のlocalStorageに保存されます。外部サーバーには送信しません。
          データ同期も行いません。
        </p>
      </div>
    </div>
  )

  const expenseModal = () => (
    <Modal onClose={() => setShowExpenseModal(false)}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800">
          {editingTransaction ? '支出を編集' : '特別支出を記録'}
        </h2>
        <button onClick={() => setShowExpenseModal(false)} className="rounded-full bg-gray-100 p-2">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <FormInput
        label="タイトル"
        value={expenseForm.title}
        onChange={(value) => setExpenseForm((prev) => ({ ...prev, title: value }))}
        placeholder="例：スーパー"
      />

      <FormInput
        label="金額"
        type="number"
        step={1000}
        value={expenseForm.amount}
        onChange={(value) => setExpenseForm((prev) => ({ ...prev, amount: value }))}
        placeholder="例：3480"
      />

      <FormInput
        label="日付"
        type="date"
        value={expenseForm.date}
        onChange={(value) => setExpenseForm((prev) => ({ ...prev, date: value }))}
      />

      <CategorySelect
        value={expenseForm.category}
        onChange={(value) => setExpenseForm((prev) => ({ ...prev, category: value }))}
        categories={allCategories}
      />

      <div className="mb-4">
        {showAddCategoryForm ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="例：美容"
              className="mb-3 w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <p className="mb-1.5 text-xs font-bold text-gray-500">アイコンを選択</p>
            <div className="mb-3 grid grid-cols-7 gap-1.5">
              {AVAILABLE_ICONS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNewCategoryIconId(item.id)}
                    title={item.label}
                    className={`flex aspect-square items-center justify-center rounded-xl ${
                      newCategoryIconId === item.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addCustomCategory('expense')}
                className="flex-1 rounded-xl bg-indigo-500 py-2 text-sm font-bold text-white"
              >
                追加
              </button>
              <button
                onClick={() => { setShowAddCategoryForm(false); setNewCategoryName('') }}
                className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-bold text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategoryForm(true)}
            className="text-sm font-bold text-indigo-500"
          >
            ＋ カテゴリを追加
          </button>
        )}
      </div>

      <button
        onClick={saveExpense}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-lg font-extrabold text-white shadow-lg shadow-indigo-500/30"
      >
        <Check className="h-5 w-5" />
        保存する
      </button>
    </Modal>
  )

  const fixedCostModal = () => (
    <Modal onClose={() => setShowFixedModal(false)}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800">
          {editingFixedCost ? '固定費を編集' : '固定費を追加'}
        </h2>
        <button onClick={() => setShowFixedModal(false)} className="rounded-full bg-gray-100 p-2">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <FormInput
        label="固定費名"
        value={fixedForm.name}
        onChange={(value) => setFixedForm((prev) => ({ ...prev, name: value }))}
        placeholder="例：家賃"
      />

      <FormInput
        label="金額"
        type="number"
        step={1000}
        value={fixedForm.amount}
        onChange={(value) => setFixedForm((prev) => ({ ...prev, amount: value }))}
        placeholder="例：85000"
      />

      <FormInput
        label="毎月の日付"
        type="number"
        value={fixedForm.day}
        onChange={(value) => setFixedForm((prev) => ({ ...prev, day: value }))}
        placeholder="1〜31"
      />

      <CategorySelect
        value={fixedForm.category}
        onChange={(value) => setFixedForm((prev) => ({ ...prev, category: value }))}
        categories={allCategories}
      />

      <div className="mb-4">
        {showAddCategoryForm ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="例：美容"
              className="mb-3 w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <p className="mb-1.5 text-xs font-bold text-gray-500">アイコンを選択</p>
            <div className="mb-3 grid grid-cols-7 gap-1.5">
              {AVAILABLE_ICONS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNewCategoryIconId(item.id)}
                    title={item.label}
                    className={`flex aspect-square items-center justify-center rounded-xl ${
                      newCategoryIconId === item.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addCustomCategory('fixed')}
                className="flex-1 rounded-xl bg-indigo-500 py-2 text-sm font-bold text-white"
              >
                追加
              </button>
              <button
                onClick={() => { setShowAddCategoryForm(false); setNewCategoryName('') }}
                className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-bold text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategoryForm(true)}
            className="text-sm font-bold text-indigo-500"
          >
            ＋ カテゴリを追加
          </button>
        )}
      </div>

      <button
        onClick={saveFixedCost}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-lg font-extrabold text-white shadow-lg shadow-indigo-500/30"
      >
        <Check className="h-5 w-5" />
        保存する
      </button>
    </Modal>
  )

  const actionPickerModal = () => (
    <Modal onClose={() => setShowActionPicker(false)}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800">何を記録しますか？</h2>
        <button onClick={() => setShowActionPicker(false)} className="rounded-full bg-gray-100 p-2">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => {
            setShowActionPicker(false)
            openAddExpense(false)
          }}
          className="flex w-full items-center gap-4 rounded-2xl bg-indigo-50 p-5 text-left"
        >
          <div className="rounded-xl bg-indigo-500 p-3 text-white">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-extrabold text-gray-800">支出を記録</p>
            <p className="mt-0.5 text-xs text-gray-400">変動支出・特別支出を登録します</p>
          </div>
        </button>
        <button
          onClick={() => {
            setShowActionPicker(false)
            setFixedAddForm({ fixedCostId: data.fixedCosts[0]?.id || '', amount: '' })
            setShowFixedAddModal(true)
          }}
          className="flex w-full items-center gap-4 rounded-2xl bg-purple-50 p-5 text-left"
        >
          <div className="rounded-xl bg-purple-500 p-3 text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="font-extrabold text-gray-800">固定費を追加</p>
            <p className="mt-0.5 text-xs text-gray-400">登録済み固定費に入金額を加算します</p>
          </div>
        </button>
      </div>
    </Modal>
  )

  const fixedAddModal = () => (
    <Modal onClose={() => setShowFixedAddModal(false)}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800">固定費を追加</h2>
        <button onClick={() => setShowFixedAddModal(false)} className="rounded-full bg-gray-100 p-2">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {data.fixedCosts.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">固定費が登録されていません</p>
      ) : (
        <>
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold text-gray-600">固定費を選択</span>
            <select
              value={fixedAddForm.fixedCostId}
              onChange={(e) => setFixedAddForm((prev) => ({ ...prev, fixedCostId: e.target.value }))}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {data.fixedCosts.map((cost) => (
                <option key={cost.id} value={cost.id}>
                  {cost.name}（基本 {formatMoney(cost.amount)}）
                </option>
              ))}
            </select>
          </label>
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold text-gray-600">追加する金額</span>
            <input
              type="number"
              step={1000}
              min={1}
              value={fixedAddForm.amount}
              onChange={(e) => setFixedAddForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="例：5000"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          {fixedAddForm.fixedCostId && (() => {
            const cost = data.fixedCosts.find((c) => c.id === fixedAddForm.fixedCostId)
            if (!cost) return null
            const adj = data.fixedCostAdjustments?.[currentMonthKey]?.[cost.id]
            const current = adj?.amount !== undefined ? Number(adj.amount) : Number(cost.amount || 0)
            const add = Number(fixedAddForm.amount) || 0
            return (
              <p className="mb-4 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600">
                現在 {formatMoney(current)} → 追加後 {formatMoney(current + add)}
              </p>
            )
          })()}
          <button
            onClick={saveFixedAdd}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-lg font-extrabold text-white shadow-lg shadow-indigo-500/30"
          >
            <Check className="h-5 w-5" />
            追加する
          </button>
        </>
      )}
    </Modal>
  )

  const bottomNav = () => {
  const items = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'fixed', label: '固定費', icon: Wallet },
    { id: 'transactions', label: '記録', icon: List },
    { id: 'reports', label: 'レポート', icon: PieChart },
    { id: 'settings', label: '設定', icon: Settings },
  ]

  const TabBtn = ({ item }) => {
    const Icon = item.icon
    const isActive = activeTab === item.id

    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-extrabold transition-colors ${
          isActive ? 'text-indigo-600' : 'text-gray-400'
        }`}
      >
        <Icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
  <div className="fixed bottom-0 left-0 right-0 z-40 rounded-b-[44px] border-t border-gray-100 bg-white/90 px-4 pt-7 backdrop-blur" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
    {/* 中央の＋ボタン：ホームタブのみ表示 */}
    {activeTab === 'home' && (
      <button
        onClick={() => setShowActionPicker(true)}
        className="absolute left-1/2 top-0 z-50 flex h-16 w-16 -translate-x-1/2 -translate-y-[120%] items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/40 ring-4 ring-white active:scale-95"
        aria-label="支出を追加"
      >
        <PlusCircle className="h-9 w-9" />
      </button>
    )}

    {/* タブ本体 */}
    <div className="grid grid-cols-5 items-end gap-1">
      {items.map((item) => (
        <TabBtn key={item.id} item={item} />
      ))}
    </div>
  </div>
)
}

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-y-auto hide-scrollbar scroll-container pb-28">
        {activeTab === 'home' && homeTab()}
        {activeTab === 'fixed' && fixedTab()}
        {activeTab === 'transactions' && transactionsTab()}
        {activeTab === 'reports' && reportsTab()}
        {activeTab === 'settings' && settingsTab()}
      </div>

      {bottomNav()}

      {showExpenseModal && expenseModal()}
      {showFixedModal && fixedCostModal()}
      {showActionPicker && actionPickerModal()}
      {showFixedAddModal && fixedAddModal()}
    </div>
  )
}