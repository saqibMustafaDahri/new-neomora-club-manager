import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/ui/FormField';
import { Select } from '../../components/ui/Select';

export function RegistrationForm() {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [program, setProgram] = useState('');
    const [term, setTerm] = useState('');
    const [joinDate, setJoinDate] = useState('');

    const [commitment, setCommitment] = useState<1 | 2 | 3>(1);
    const [includeKit, setIncludeKit] = useState(false);
    const [paymentOption, setPaymentOption] = useState<'none' | 'full'>('none');

    // Check if required fields are filled to show calculation
    const isCalculationUnblocked = location !== '' && program !== '' && term !== '' && joinDate !== '';

    // Let's make a simple dynamic calculation based on state
    let weeksBilled = commitment * 10 + (commitment === 3 ? 1 : 0); // 31 weeks for 3 terms
    const baseBeforeDiscount = weeksBilled * (7130 / 31); // 7130

    let discountPercent = 0;
    if (commitment === 2) discountPercent = 0.05;
    if (commitment === 3) discountPercent = 0.10;

    const discountAmount = baseBeforeDiscount * discountPercent;
    const baseAfterDiscount = baseBeforeDiscount - discountAmount;

    const kitFee = includeKit ? 250 : 0;
    const regFee = 150;

    const subtotal = baseAfterDiscount + kitFee + regFee;
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/super-admin/register')}
                className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Student List
            </button>

            <div>
                <h1 className="text-2xl font-bold text-text">Register Student</h1>
                <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">
                    Create or select a family, choose the student and program details, then review the live fee calculation. No fee field can be typed manually.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Family */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-text mb-4">1. Family</h2>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-text">Search existing family</label>
                                    <span className="text-xs text-text-muted">Search first to avoid duplicates</span>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Guardian Name, Phone or Email"
                                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 text-primary text-sm p-3 rounded-md">
                                No family selected. Complete the fields below to create a new family during registration.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Guardian name" required>
                                    {(id) => <input id={id} type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />}
                                </FormField>
                                <FormField label="Phone" required>
                                    {(id) => <input id={id} type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />}
                                </FormField>
                                <FormField label="Email">
                                    {(id) => <input id={id} type="email" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />}
                                </FormField>
                                <FormField label="Primary location" required>
                                    {(id) => (
                                        <Select id={id} defaultValue="" containerClassName="w-full" className="px-3 py-2 text-sm text-text-muted bg-background">
                                            <option value="" disabled>Select location</option>
                                            <option value="Jeddah">Jeddah</option>
                                            <option value="Riyadh">Riyadh</option>
                                        </Select>
                                    )}
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* 2. Student */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-text">2. Student</h2>
                            <span className="text-xs text-text-muted">Existing family students appear automatically</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="First name" required>
                                {(id) => <input id={id} type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />}
                            </FormField>
                            <FormField label="Last name" required>
                                {(id) => <input id={id} type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />}
                            </FormField>
                            <FormField label="Date of birth" required>
                                {(id) => <input id={id} type="date" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-text-muted" />}
                            </FormField>
                            <FormField label="Gender" required>
                                {(id) => (
                                    <Select id={id} defaultValue="" containerClassName="w-full" className="px-3 py-2 text-sm text-text-muted bg-background">
                                        <option value="" disabled>Select</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </Select>
                                )}
                            </FormField>
                        </div>
                    </div>

                    {/* 3. Registration */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-text">3. Registration</h2>
                            <span className="text-xs text-text-muted">Price updates live from Payment Structure</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <FormField label="Location" required>
                                {(id) => (
                                    <Select id={id} value={location} onChange={e => setLocation(e.target.value)} containerClassName="w-full" className={`px-3 py-2 text-sm bg-background ${location === '' ? 'text-text-muted' : ''}`}>
                                        <option value="" disabled>Select location</option>
                                        <option value="Jeddah">Jeddah</option>
                                        <option value="Riyadh">Riyadh</option>
                                    </Select>
                                )}
                            </FormField>
                            <FormField label="Program" required>
                                {(id) => (
                                    <Select id={id} value={program} onChange={e => setProgram(e.target.value)} containerClassName="w-full" className={`px-3 py-2 text-sm bg-background ${program === '' ? 'text-text-muted' : ''}`}>
                                        <option value="" disabled>Select program</option>
                                        <option value="Football Academy">Football Academy</option>
                                        <option value="Basketball Academy">Basketball Academy</option>
                                        <option value="Swimming Academy">Swimming Academy</option>
                                    </Select>
                                )}
                            </FormField>
                            <FormField label="Term" required>
                                {(id) => (
                                    <Select id={id} value={term} onChange={e => setTerm(e.target.value)} containerClassName="w-full" className={`px-3 py-2 text-sm bg-background ${term === '' ? 'text-text-muted' : ''}`}>
                                        <option value="" disabled>Select term</option>
                                        <option value="Jeddah Summer 2026">Jeddah Summer 2026</option>
                                        <option value="Riyadh Summer 2026">Riyadh Summer 2026</option>
                                    </Select>
                                )}
                            </FormField>
                            <FormField label="Join date" required>
                                {(id) => <input id={id} type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} className={`w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ${joinDate === '' ? 'text-text-muted' : ''}`} />}
                            </FormField>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text">Commitment length</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3].map(val => (
                                        <label key={val} className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-colors ${commitment === val ? 'bg-primary/5 border-primary text-primary' : 'border-border text-text hover:bg-surface-muted'}`}>
                                            <input
                                                type="radio"
                                                name="commitment"
                                                checked={commitment === val}
                                                onChange={() => setCommitment(val as 1 | 2 | 3)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <span className="text-sm font-medium">{val} term{val > 1 ? 's' : ''}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeKit}
                                    onChange={(e) => setIncludeKit(e.target.checked)}
                                    className="w-4 h-4 accent-primary rounded"
                                />
                                <span className="text-sm text-primary font-medium">Include academy kit if the active rate card has a kit fee</span>
                            </label>
                        </div>
                    </div>

                    {/* 4. Payment */}
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-text">4. Payment at registration</h2>
                            <span className="text-xs text-text-muted">No payment amount can be typed</span>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-colors ${paymentOption === 'none' ? 'bg-primary/5 border-primary text-primary' : 'border-border text-text hover:bg-surface-muted'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentOption === 'none'}
                                    onChange={() => setPaymentOption('none')}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span className="text-sm font-medium">Record no payment now</span>
                            </label>
                            <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-colors ${paymentOption === 'full' ? 'bg-primary/5 border-primary text-primary' : 'border-border text-text hover:bg-surface-muted'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentOption === 'full'}
                                    onChange={() => setPaymentOption('full')}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span className="text-sm font-medium">Pay full calculated invoice now</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Payment method">
                                {(id) => (
                                    <Select id={id} defaultValue="" disabled={paymentOption === 'none'} containerClassName="w-full" className="px-3 py-2 text-sm bg-background">
                                        <option value="" disabled>Select</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </Select>
                                )}
                            </FormField>
                            <FormField label="Reference">
                                {(id) => <input id={id} type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" disabled={paymentOption === 'none'} />}
                            </FormField>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
                            <button className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-muted rounded-md transition-colors">
                                Clear form
                            </button>
                            <button className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm">
                                Create Registration & Invoice
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Live Calculation panel */}
                <div className="sticky top-6 space-y-4">
                    {!isCalculationUnblocked ? (
                        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col p-6">
                            <div className="mb-4">
                                <h3 className="font-bold text-text text-base">Live Fee Summary</h3>
                                <p className="text-xs text-text-muted mt-0.5">Calculated from Payment Structure</p>
                            </div>
                            <div className="bg-danger/5 border border-danger/20 rounded-md p-4 flex gap-3 text-sm">
                                <span className="font-semibold text-danger">Calculation blocked:</span>
                                <span className="text-danger opacity-90">Select a location, program, term and join date to calculate the fee.</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-br from-primary to-green-600 p-6 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-90">Registration Total</p>
                                <h2 className="text-3xl font-bold mb-1">SAR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                <p className="text-xs opacity-80">Live from configured rate, discount and VAT rules</p>
                            </div>

                            <div className="p-6 bg-surface">
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Weeks billed</span>
                                        <span className="font-semibold text-text">{weeksBilled}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Base amount after discount</span>
                                        <span className="font-semibold text-text">SAR {baseAfterDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>

                                    {discountPercent > 0 && (
                                        <>
                                            <div className="flex justify-between items-center text-success">
                                                <span>Discount</span>
                                                <span className="font-semibold">{discountPercent * 100}% - -SAR {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-text-muted">Matched rule</span>
                                                <span className="font-medium text-text text-right text-xs">Term commitment {commitment > 1 ? (commitment === 2 ? '15-23' : '24-35') : ''} weeks</span>
                                            </div>
                                        </>
                                    )}

                                    {includeKit && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-muted">Kit fee</span>
                                            <span className="font-semibold text-text">SAR {kitFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">Registration fee</span>
                                        <span className="font-semibold text-text">SAR {regFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted">VAT (15%)</span>
                                        <span className="font-semibold text-text">SAR {vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border">
                                    <p className="text-[11px] text-text-muted text-center leading-relaxed">
                                        No editable fee field exists. Submission uses this exact calculation result.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-primary text-xs">
                        <p className="leading-relaxed">
                            All figures shown here are returned by the <span className="font-mono bg-primary/10 px-1 rounded">calculateFee()</span> engine. Staff cannot override or type any fee amount.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
