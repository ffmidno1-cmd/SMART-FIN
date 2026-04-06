/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Calculator, 
  Percent, 
  TrendingUp, 
  CreditCard, 
  Info, 
  ChevronRight,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { cn, formatCurrency } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// --- Components ---

const AdPlaceholder = ({ className, label = "Advertisement" }: { className?: string, label?: string }) => (
  <div className={cn("bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium overflow-hidden", className)}>
    <div className="text-center p-4">
      <p className="uppercase tracking-widest text-[10px] mb-1">{label}</p>
      <p>Google AdSense Slot</p>
    </div>
  </div>
);

const SliderInput = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  suffix = "", 
  prefix = "" 
}: { 
  label: string, 
  value: number, 
  min: number, 
  max: number, 
  step?: number, 
  onChange: (val: number) => void,
  suffix?: string,
  prefix?: string
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value.toString());
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    let num = parseFloat(tempValue);
    if (isNaN(num)) num = value;
    if (num < min) num = min;
    if (num > max) num = max;
    onChange(num);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter mb-0.5">Enter Number</span>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-bold text-sm border border-blue-100 flex items-center gap-1 focus-within:border-blue-400 transition-colors">
            {prefix && <span>{prefix}</span>}
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
              className="bg-transparent border-none outline-none w-20 text-right font-bold text-blue-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {suffix && <span>{suffix}</span>}
          </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, colorClass = "text-blue-600" }: { label: string, value: string, colorClass?: string }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
    <p className={cn("text-2xl font-black", colorClass)}>{value}</p>
  </div>
);

// --- Calculators ---

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const results = useMemo(() => {
    const P = monthlyInvestment;
    const i = expectedReturn / 100 / 12;
    const n = timePeriod * 12;
    
    // Formula: P × [({1 + i}^n - 1) / i] × (1 + i)
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvestment = P * n;
    const estimatedReturns = totalValue - totalInvestment;

    return {
      totalInvestment,
      estimatedReturns,
      totalValue
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const chartData = {
    labels: ['Invested Amount', 'Est. Returns'],
    datasets: [
      {
        data: [results.totalInvestment, results.estimatedReturns],
        backgroundColor: ['#e2e8f0', '#2563eb'],
        hoverBackgroundColor: ['#cbd5e1', '#1d4ed8'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          SIP Calculator
        </h3>
        
        <SliderInput 
          label="Monthly Investment" 
          value={monthlyInvestment} 
          min={0} 
          max={100000} 
          step={500} 
          onChange={setMonthlyInvestment} 
          prefix="₹" 
        />
        <SliderInput 
          label="Expected Return Rate (p.a)" 
          value={expectedReturn} 
          min={1} 
          max={30} 
          step={0.5} 
          onChange={setExpectedReturn} 
          suffix="%" 
        />
        <SliderInput 
          label="Time Period" 
          value={timePeriod} 
          min={1} 
          max={40} 
          onChange={setTimePeriod} 
          suffix=" Yr" 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Invested Amount" value={formatCurrency(results.totalInvestment)} colorClass="text-gray-700" />
          <ResultCard label="Est. Returns" value={formatCurrency(results.estimatedReturns)} colorClass="text-green-600" />
          <div className="sm:col-span-2">
            <ResultCard label="Total Value" value={formatCurrency(results.totalValue)} colorClass="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Wealth Breakdown</h4>
        <div className="w-full max-w-[300px]">
          <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 max-w-xs italic">
          "SIP is a disciplined way of investing in mutual funds, allowing you to benefit from rupee cost averaging."
        </div>
      </div>
    </div>
  );
};

const GSTCalculator = () => {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const results = useMemo(() => {
    let gstAmount = 0;
    let totalAmount = 0;
    let originalAmount = amount;

    if (type === 'exclusive') {
      gstAmount = (amount * gstRate) / 100;
      totalAmount = amount + gstAmount;
    } else {
      totalAmount = amount;
      originalAmount = amount * (100 / (100 + gstRate));
      gstAmount = totalAmount - originalAmount;
    }

    return {
      gstAmount,
      totalAmount,
      originalAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2
    };
  }, [amount, gstRate, type]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Percent className="text-blue-600" size={24} />
          GST Calculator
        </h3>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setType('exclusive')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", type === 'exclusive' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            GST Exclusive
          </button>
          <button 
            onClick={() => setType('inclusive')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", type === 'inclusive' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            GST Inclusive
          </button>
        </div>
        
        <SliderInput 
          label="Total Amount" 
          value={amount} 
          min={0} 
          max={500000} 
          step={100} 
          onChange={setAmount} 
          prefix="₹" 
        />
        
        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">GST Rate (%)</label>
          <div className="grid grid-cols-5 gap-2">
            {[5, 12, 18, 28].map(rate => (
              <button 
                key={rate}
                onClick={() => setGstRate(rate)}
                className={cn(
                  "py-2 rounded-lg text-sm font-bold border transition-all",
                  gstRate === rate ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                )}
              >
                {rate}%
              </button>
            ))}
            <div className="flex flex-col">
              <span className="text-[8px] text-blue-400 font-bold uppercase tracking-tighter mb-0.5 text-center">Type</span>
              <div className={cn(
                "flex items-center border rounded-lg px-2 py-1 transition-all focus-within:border-blue-400",
                ![5, 12, 18, 28].includes(gstRate) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-400"
              )}>
                <input 
                  type="number" 
                  value={![5, 12, 18, 28].includes(gstRate) ? gstRate : ''} 
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  placeholder="Other"
                  className="w-full bg-transparent border-none outline-none text-xs font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-400"
                />
                <span className="text-[10px] font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Base Amount" value={formatCurrency(results.originalAmount)} colorClass="text-gray-700" />
          <ResultCard label="Total GST" value={formatCurrency(results.gstAmount)} colorClass="text-orange-600" />
          <ResultCard label="CGST (50%)" value={formatCurrency(results.cgst)} colorClass="text-gray-500" />
          <ResultCard label="SGST (50%)" value={formatCurrency(results.sgst)} colorClass="text-gray-500" />
          <div className="sm:col-span-2">
            <ResultCard label="Total Amount" value={formatCurrency(results.totalAmount)} colorClass="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">GST Breakdown</h4>
        <div className="w-full h-64">
           <Bar 
            data={{
              labels: ['Base', 'GST'],
              datasets: [{
                label: 'Amount (₹)',
                data: [results.originalAmount, results.gstAmount],
                backgroundColor: ['#3b82f6', '#f97316'],
                borderRadius: 8,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
           />
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
          <p className="font-bold mb-1 flex items-center gap-1"><Info size={14} /> Quick Tip</p>
          GST (Goods and Services Tax) is an indirect tax used in India on the supply of goods and services.
        </div>
      </div>
    </div>
  );
};

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const results = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    
    // Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayment
    };
  }, [loanAmount, interestRate, tenure]);

  const chartData = {
    labels: ['Principal Loan Amount', 'Total Interest'],
    datasets: [
      {
        data: [loanAmount, results.totalInterest],
        backgroundColor: ['#2563eb', '#f43f5e'],
        hoverBackgroundColor: ['#1d4ed8', '#e11d48'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <CreditCard className="text-blue-600" size={24} />
          EMI Calculator
        </h3>
        
        <SliderInput 
          label="Loan Amount" 
          value={loanAmount} 
          min={0} 
          max={10000000} 
          step={10000} 
          onChange={setLoanAmount} 
          prefix="₹" 
        />
        <SliderInput 
          label="Interest Rate (p.a)" 
          value={interestRate} 
          min={1} 
          max={20} 
          step={0.1} 
          onChange={setInterestRate} 
          suffix="%" 
        />
        <SliderInput 
          label="Loan Tenure" 
          value={tenure} 
          min={1} 
          max={30} 
          onChange={setTenure} 
          suffix=" Yr" 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Monthly EMI" value={formatCurrency(results.monthlyEmi)} colorClass="text-blue-600" />
          <ResultCard label="Principal Amount" value={formatCurrency(loanAmount)} colorClass="text-gray-700" />
          <ResultCard label="Total Interest" value={formatCurrency(results.totalInterest)} colorClass="text-rose-600" />
          <ResultCard label="Total Payment" value={formatCurrency(results.totalPayment)} colorClass="text-gray-900" />
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Payment Breakdown</h4>
        <div className="w-full max-w-[300px]">
          <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 max-w-xs">
          Your monthly EMI will be <span className="font-bold text-blue-600">{formatCurrency(results.monthlyEmi)}</span> for the next {tenure * 12} months.
        </div>
      </div>
    </div>
  );
};

const FDCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(5);

  const results = useMemo(() => {
    const P = principal;
    const r = rate / 100;
    const t = time;
    const n = 4; // Quarterly compounding
    
    // Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;

    return {
      totalInterest,
      maturityAmount
    };
  }, [principal, rate, time]);

  const chartData = {
    labels: ['Principal Amount', 'Total Interest'],
    datasets: [
      {
        data: [principal, results.totalInterest],
        backgroundColor: ['#e2e8f0', '#059669'],
        hoverBackgroundColor: ['#cbd5e1', '#047857'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Calculator className="text-blue-600" size={24} />
          FD Calculator
        </h3>
        
        <SliderInput 
          label="Total Investment" 
          value={principal} 
          min={0} 
          max={10000000} 
          step={1000} 
          onChange={setPrincipal} 
          prefix="₹" 
        />
        <SliderInput 
          label="Rate of Interest (p.a)" 
          value={rate} 
          min={1} 
          max={15} 
          step={0.1} 
          onChange={setRate} 
          suffix="%" 
        />
        <SliderInput 
          label="Time Period" 
          value={time} 
          min={1} 
          max={25} 
          onChange={setTime} 
          suffix=" Yr" 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <ResultCard label="Invested Amount" value={formatCurrency(principal)} colorClass="text-gray-700" />
          <ResultCard label="Est. Returns" value={formatCurrency(results.totalInterest)} colorClass="text-emerald-600" />
          <div className="sm:col-span-2">
            <ResultCard label="Total Value" value={formatCurrency(results.maturityAmount)} colorClass="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Maturity Breakdown</h4>
        <div className="w-full max-w-[300px]">
          <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 max-w-xs italic">
          "Fixed Deposit is a safe investment option that offers guaranteed returns over a fixed period."
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'sip' | 'gst' | 'emi' | 'fd'>('sip');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'sip', name: 'SIP Calculator', icon: TrendingUp },
    { id: 'gst', name: 'GST Calculator', icon: Percent },
    { id: 'emi', name: 'EMI Calculator', icon: CreditCard },
    { id: 'fd', name: 'FD Calculator', icon: Calculator },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* SEO Meta Tags (Simulated) */}
      <header className="hidden">
        <h1>Smart Finance Tools - SIP, GST, EMI, FD Calculators</h1>
        <p>Calculate your investments and loans with our professional fintech calculators.</p>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-blue-900">SMART<span className="text-blue-600">FIN</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "text-sm font-bold transition-colors",
                    activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                  )}
                >
                  {tab.name}
                </button>
              ))}
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold",
                      activeTab === tab.id ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Ad Slot */}
        <AdPlaceholder className="h-24 mb-12" label="Top Banner Ad" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-12">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                Financial Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                Smart Financial <span className="text-blue-600">Calculators</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl">
                Plan your future with precision. Our suite of professional calculators helps you make informed decisions about your wealth and taxes.
              </p>
            </div>

            {/* Calculator Switcher (Desktop Tabs) */}
            <div className="flex flex-wrap gap-2 mb-10">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2",
                    activeTab === tab.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 -translate-y-1" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Active Calculator Component */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'sip' && <SIPCalculator />}
              {activeTab === 'gst' && <GSTCalculator />}
              {activeTab === 'emi' && <EMICalculator />}
              {activeTab === 'fd' && <FDCalculator />}
            </motion.div>

            {/* Mid-Content Ad Slot */}
            <AdPlaceholder className="h-48 mt-16" label="In-Feed Native Ad" />

            {/* Features Section */}
            <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <TrendingUp size={24} />
                </div>
                <h4 className="text-lg font-bold mb-3">Real-time Analysis</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Get instant results as you slide. Our calculators process complex financial formulas in real-time.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <Percent size={24} />
                </div>
                <h4 className="text-lg font-bold mb-3">Accurate Logic</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Built using standard banking and taxation formulas to ensure 100% accuracy in all your calculations.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <Calculator size={24} />
                </div>
                <h4 className="text-lg font-bold mb-3">Visual Insights</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Don't just see numbers. Understand your wealth breakdown with interactive charts and visualizations.</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
            <AdPlaceholder className="h-[600px]" label="Vertical Sidebar Ad" />
            
            <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
              <h4 className="text-xl font-bold mb-4 relative z-10">Need Expert Advice?</h4>
              <p className="text-blue-200 text-sm mb-6 relative z-10">Connect with our certified financial planners for a personalized wealth strategy.</p>
              <button className="w-full bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors relative z-10">
                Book a Consultation
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h4 className="font-bold mb-4 text-gray-900">Popular Tools</h4>
              <ul className="space-y-3">
                {tabs.map(tab => (
                  <li key={tab.id}>
                    <button 
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <tab.icon size={14} />
                        {tab.name}
                      </span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Calculator className="text-white" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter text-blue-900">SMART<span className="text-blue-600">FIN</span></span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                SmartFin is your go-to destination for professional financial tools. We empower users with accurate, easy-to-use calculators for better financial planning.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 mb-6">Calculators</h5>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><button onClick={() => setActiveTab('sip')} className="hover:text-blue-600">SIP Calculator</button></li>
                <li><button onClick={() => setActiveTab('gst')} className="hover:text-blue-600">GST Calculator</button></li>
                <li><button onClick={() => setActiveTab('emi')} className="hover:text-blue-600">EMI Calculator</button></li>
                <li><button onClick={() => setActiveTab('fd')} className="hover:text-blue-600">FD Calculator</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 mb-6">Connect</h5>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-100 p-3 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"><Twitter size={18} /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"><Linkedin size={18} /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"><Github size={18} /></a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-xs text-center md:text-left">
              © 2026 SmartFin Tools. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Disclaimer</a>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] text-gray-400 leading-relaxed">
            <p className="font-bold mb-2 uppercase tracking-widest text-gray-500">Disclaimer</p>
            The calculators provided on this website are for informational purposes only and do not constitute financial advice. While we strive for accuracy, the results generated are estimates and may vary based on specific banking policies, tax laws, and market conditions. Please consult with a certified financial advisor before making any investment or loan decisions.
          </div>
        </div>
      </footer>
    </div>
  );
}
