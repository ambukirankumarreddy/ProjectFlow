import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProcurementItem } from '../../types';
import { Badge } from '../common/Badge';
import { MetricCard } from '../common/MetricCard';
import { Modal } from '../common/Modal';
import { formatINR, formatIndianDate } from '../../utils/formatters';
import {
  Cpu,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  Package,
  Layers,
  FileText
} from 'lucide-react';

export const BOMManagement: React.FC = () => {
  const { bomItems, addBOMItem, updateBOMItemStatus, selectedProject } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New BOM state in INR
  const [itemCode, setItemCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProcurementItem['category']>('Hardware');
  const [requiredQty, setRequiredQty] = useState(1);
  const [unitPriceINR, setUnitPriceINR] = useState(85000);
  const [vendor, setVendor] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-09-01');
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  const filtered = bomItems.filter(item => {
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalBOMCost = bomItems.reduce((acc, curr) => acc + curr.unitPriceINR * curr.requiredQty, 0);
  const deliveredCount = bomItems.filter(b => b.status === 'Delivered' || b.status === 'Allocated').length;
  const inTransitCount = bomItems.filter(b => b.status === 'Ordered' || b.inspectionStatus === 'In Transit').length;

  const handleCreateBOM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemCode || !description) return;

    const newItem: ProcurementItem = {
      id: `bom-${Date.now()}`,
      itemCode,
      description,
      category,
      requiredQty: Number(requiredQty) || 1,
      availableQty: 0,
      unitPriceINR: Number(unitPriceINR) || 10000,
      currency: 'INR',
      vendor: vendor || 'Defense Supplier India',
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryDate,
      inspectionStatus: 'Pending',
      warrantyMonths: Number(warrantyMonths) || 12,
      linkedProjectId: selectedProject?.id || 'proj-1',
      status: 'Requested',
    };

    addBOMItem(newItem);
    setIsAddModalOpen(false);
    setItemCode('');
    setDescription('');
    setVendor('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Procurement & Bill of Materials (BOM)</span>
            <Badge variant="warning" size="sm">
              Simulator Hardware & Electronics
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Hardware, Electrical, Mechanical, and Software licenses with vendor quotes and PO tracking in Indian Rupees (₹)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add BOM Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total BOM Valuation"
          value={formatINR(totalBOMCost)}
          subtitle={`${bomItems.length} Procured Line Items`}
          icon={IndianRupee}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="Items In Transit"
          value={inTransitCount}
          subtitle="Moog Series 760 delivery Aug 22"
          icon={Truck}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <MetricCard
          title="Delivered & Allocated"
          value={`${deliveredCount} / ${bomItems.length}`}
          subtitle={`${Math.round((deliveredCount / (bomItems.length || 1)) * 100)}% Fulfilled`}
          icon={CheckCircle}
          iconColor="text-brand-400 bg-brand-500/10 border-brand-500/20"
        />
        <MetricCard
          title="Inspection QA Pass"
          value="100%"
          subtitle="Zero defective hardware components"
          icon={Package}
          iconColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search part code, vendor, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Hardware">Hardware BOM</option>
          <option value="Electronics">Electronics BOM</option>
          <option value="Electrical">Electrical BOM</option>
          <option value="Mechanical">Mechanical BOM</option>
          <option value="Software/License">Software / Licenses</option>
        </select>
      </div>

      {/* BOM Items Table */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Part / Item Code</th>
                <th className="py-3 px-4">Description & Specification</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Qty (Req / Avail)</th>
                <th className="py-3 px-4">Unit Price (₹)</th>
                <th className="py-3 px-4">Vendor & PO</th>
                <th className="py-3 px-4">Est Delivery</th>
                <th className="py-3 px-4">Inspection</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-400 whitespace-nowrap">
                    {item.itemCode}
                  </td>
                  <td className="py-3.5 px-4 max-w-sm font-sans">
                    <div className="font-semibold text-slate-200">{item.description}</div>
                    <div className="text-[10px] text-slate-500">{item.warrantyMonths}m Warranty</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <Badge variant="neutral" size="sm">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-100">{item.availableQty}</span>
                    <span className="text-slate-500"> / {item.requiredQty}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                    {formatINR(item.unitPriceINR)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <div className="text-slate-200">{item.vendor}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.poNumber || 'Pending PO'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-sans">
                    {formatIndianDate(item.deliveryDate)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <Badge
                      variant={
                        item.inspectionStatus === 'Passed'
                          ? 'success'
                          : item.inspectionStatus === 'In Transit'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.inspectionStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <Badge
                      variant={
                        item.status === 'Allocated' || item.status === 'Delivered'
                          ? 'success'
                          : item.status === 'Ordered'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-sans">
                    {item.status === 'Ordered' && (
                      <button
                        onClick={() => updateBOMItemStatus(item.id, 'Delivered')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add BOM Item Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Procurement BOM Item"
          subtitle="Add hardware, mechanical, electrical, or software license component with price in INR"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateBOM} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Part / Item Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HW-CAN-PEAK-01"
                  value={itemCode}
                  onChange={e => setItemCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Hardware">Hardware BOM</option>
                  <option value="Electronics">Electronics BOM</option>
                  <option value="Electrical">Electrical BOM</option>
                  <option value="Mechanical">Mechanical BOM</option>
                  <option value="Software/License">Software / License</option>
                  <option value="Raw Material">Raw Material</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Specification & Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dual-channel opto-isolated CAN bus transceiver"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Qty</label>
                <input
                  type="number"
                  value={requiredQty}
                  onChange={e => setRequiredQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹ INR)</label>
                <input
                  type="number"
                  value={unitPriceINR}
                  onChange={e => setUnitPriceINR(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Warranty (Months)</label>
                <input
                  type="number"
                  value={warrantyMonths}
                  onChange={e => setWarrantyMonths(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vendor / Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Peak-System Hardware GmbH"
                  value={vendor}
                  onChange={e => setVendor(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-brand"
              >
                Add BOM Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
