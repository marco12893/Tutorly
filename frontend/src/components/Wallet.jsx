import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus,
  CreditCard,
  Building,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Wallet = () => {
  const { user, updateWallet } = useContext(AuthContext);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('e_wallet');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [loading, setLoading] = useState({ deposit: false, withdraw: false });
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock transaction data
  const mockTransactions = [
    {
      id: '1',
      type: 'deposit',
      amount: 500000,
      method: 'E-Wallet (GoPay)',
      status: 'completed',
      description: 'Wallet top-up',
      date: '2024-09-24T10:30:00',
      reference: 'DEP001'
    },
    {
      id: '2',
      type: 'payment',
      amount: -175000,
      method: 'Wallet Balance',
      status: 'completed',
      description: 'Payment for Mathematics tutoring',
      date: '2024-09-23T14:00:00',
      reference: 'PAY001',
      tutor: 'Sarah Chen'
    },
    {
      id: '3',
      type: 'earning',
      amount: 180000,
      method: 'Session Payment',
      status: 'completed',
      description: 'Earned from Computer Science tutoring',
      date: '2024-09-22T16:00:00',
      reference: 'ERN001',
      student: 'Lisa Chen'
    },
    {
      id: '4',
      type: 'withdraw',
      amount: -200000,
      method: 'Bank Transfer',
      status: 'pending',
      description: 'Withdrawal to Bank BCA',
      date: '2024-09-21T09:15:00',
      reference: 'WDR001'
    },
    {
      id: '5',
      type: 'deposit',
      amount: 300000,
      method: 'Bank Transfer',
      status: 'completed',
      description: 'Bank transfer deposit',
      date: '2024-09-20T11:20:00',
      reference: 'DEP002'
    },
    {
      id: '6',
      type: 'earning',
      amount: 200000,
      method: 'Session Payment',
      status: 'completed',
      description: 'Earned from Mathematics tutoring',
      date: '2024-09-19T13:30:00',
      reference: 'ERN002',
      student: 'Ahmad Rizki'
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'withdraw': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'payment': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'earning': return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      default: return <WalletIcon className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return 'text-emerald-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount < 50000) {
      toast.error('Minimum deposit amount is Rp 50,000');
      return;
    }

    setLoading(prev => ({ ...prev, deposit: true }));

    try {
      // Mock API call
      console.log('Processing deposit:', {
        amount: parseFloat(depositAmount),
        method: depositMethod
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      updateWallet(parseFloat(depositAmount), 'add');
      toast.success(`Successfully deposited ${formatCurrency(parseFloat(depositAmount))}`);
      setDepositAmount('');

    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to process deposit. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount < 100000) {
      toast.error('Minimum withdrawal amount is Rp 100,000');
      return;
    }

    if (parseFloat(withdrawAmount) > user.wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(prev => ({ ...prev, withdraw: true }));

    try {
      // Mock API call
      console.log('Processing withdrawal:', {
        amount: parseFloat(withdrawAmount),
        method: withdrawMethod
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      updateWallet(parseFloat(withdrawAmount), 'subtract');
      toast.success(`Withdrawal request of ${formatCurrency(parseFloat(withdrawAmount))} submitted`);
      setWithdrawAmount('');

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  // Calculate stats
  const stats = {
    totalDeposits: mockTransactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: Math.abs(mockTransactions
      .filter(t => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)),
    totalEarnings: mockTransactions
      .filter(t => t.type === 'earning' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalSpent: Math.abs(mockTransactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0))
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Wallet</h1>
            <p className="text-slate-600 mt-2">Manage your balance and transactions</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Current Balance</p>
                <p className="text-4xl font-bold">{formatCurrency(user.wallet.balance)}</p>
                <p className="text-blue-100 mt-2">Available for use</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <WalletIcon className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Deposit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount (IDR)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        min="50000"
                        step="25000"
                      />
                      <p className="text-sm text-slate-500 mt-1">Minimum: Rp 50,000</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="deposit-method">Payment Method</Label>
                      <Select value={depositMethod} onValueChange={setDepositMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="e_wallet">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-4 h-4" />
                              <span>E-Wallet (GoPay, OVO, DANA)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="bank_transfer">
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4" />
                              <span>Bank Transfer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="credit_card">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4" />
                              <span>Credit/Debit Card</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleDeposit} 
                      disabled={loading.deposit}
                      className="w-full btn-primary"
                    >
                      {loading.deposit ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Deposit {depositAmount && formatCurrency(parseFloat(depositAmount))}
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 flex items-center space-x-2"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Withdraw</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Available balance: {formatCurrency(user.wallet.balance)}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="withdraw-amount">Amount (IDR)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min="100000"
                        step="25000"
                        max={user.wallet.balance}
                      />
                      <p className="text-sm text-slate-500 mt-1">Minimum: Rp 100,000</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                      <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4" />
                              <span>Bank Transfer</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="e_wallet">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-4 h-4" />
                              <span>E-Wallet</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={loading.withdraw}
                      className="w-full btn-secondary"
                    >
                      {loading.withdraw ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <Minus className="w-4 h-4 mr-2" />
                          Withdraw {withdrawAmount && formatCurrency(parseFloat(withdrawAmount))}
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Deposits</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalDeposits)}</p>
                </div>
                <ArrowDownLeft className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalWithdrawals)}</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <Plus className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Spent</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <Minus className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-slate-500">{transaction.method}</p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(transaction.date)} • Ref: {transaction.reference}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    {(transaction.tutor || transaction.student) && (
                      <p className="text-sm text-slate-500">
                        {transaction.tutor ? `to ${transaction.tutor}` : `from ${transaction.student}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">
                Load More Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;