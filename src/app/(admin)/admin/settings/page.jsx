'use client';

import { useState } from 'react';
import {
  Store,
  CreditCard,
  Truck,
  Mail,
  Users,
  Percent,
  SettingsIcon,
  Save,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  const [saving, setSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'store', label: 'Store Information', icon: <Store size={18} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'email', label: 'Email Templates', icon: <Mail size={18} /> },
    { id: 'users', label: 'User Management', icon: <Users size={18} /> },
    { id: 'tax', label: 'Tax Settings', icon: <Percent size={18} /> },
    {
      id: 'general',
      label: 'General Settings',
      icon: <SettingsIcon size={18} />,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400"
        >
          {saving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {showSavedMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
          <span className="mr-2">✓</span>
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'store' && <StoreInformationSettings />}
          {activeTab === 'payment' && <PaymentMethodsSettings />}
          {activeTab === 'shipping' && <ShippingSettings />}
          {activeTab === 'email' && <EmailTemplateSettings />}
          {activeTab === 'users' && <UserManagementSettings />}
          {activeTab === 'tax' && <TaxSettings />}
          {activeTab === 'general' && <GeneralSettings />}
        </div>
      </div>
    </div>
  );
}

function StoreInformationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Store Information</h2>
      <p className="text-gray-600 text-sm">
        Update your store details and contact information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            defaultValue="2MMC"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Legal Business Name
          </label>
          <input
            type="text"
            defaultValue="2MMC B.V."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="info@benzo.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+31 6 12345678"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            defaultValue="Hoofdstraat 123"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              defaultValue="Amsterdam"
              placeholder="City"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <input
              type="text"
              defaultValue="1012 AB"
              placeholder="Postal Code"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VAT Number
          </label>
          <input
            type="text"
            defaultValue="NL123456789B01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chamber of Commerce Number
          </label>
          <input
            type="text"
            defaultValue="12345678"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Store Logo
        </label>
        <div className="flex items-center">
          <div className="h-16 w-32 bg-gray-100 rounded-md flex items-center justify-center mr-4">
            <span className="text-gray-400">Logo</span>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Upload New Logo
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodsSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Payment Methods</h2>
      <p className="text-gray-600 text-sm">
        Configure the payment methods available to your customers.
      </p>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ideal"
                defaultChecked
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="ideal"
                className="ml-2 block text-sm text-gray-900"
              >
                iDEAL
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="creditcard"
                defaultChecked
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="creditcard"
                className="ml-2 block text-sm text-gray-900"
              >
                Credit Card
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paypal"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="paypal"
                className="ml-2 block text-sm text-gray-900"
              >
                PayPal
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bancontact"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="bancontact"
                className="ml-2 block text-sm text-gray-900"
              >
                Bancontact
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Currency Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Display Format
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="symbol_before">€10.00</option>
              <option value="symbol_after">10.00€</option>
              <option value="code_before">EUR 10.00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Shipping Settings</h2>
      <p className="text-gray-600 text-sm">
        Configure shipping methods and delivery options.
      </p>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="standard"
                defaultChecked
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="standard"
                className="ml-2 block text-sm text-gray-900"
              >
                Standard Shipping
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
          <div className="mt-2 pl-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>€4.95</span>
              <span>1-2 business days</span>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="express"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="express"
                className="ml-2 block text-sm text-gray-900"
              >
                Express Shipping
              </label>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Configure
            </button>
          </div>
          <div className="mt-2 pl-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>€9.95</span>
              <span>Next business day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Free Shipping</h3>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="enable_free_shipping"
            defaultChecked
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="enable_free_shipping"
            className="ml-2 block text-sm text-gray-900"
          >
            Enable free shipping for orders above a certain amount
          </label>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">
            Minimum order amount:
          </span>
          <div className="relative rounded-md shadow-sm w-32">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="text"
              defaultValue="25.00"
              className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Shipping Zones</h3>
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Netherlands</h4>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Belgium</h4>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Germany</h4>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit
            </button>
          </div>
        </div>
        <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 flex items-center">
          + Add Shipping Zone
        </button>
      </div>
    </div>
  );
}

function EmailTemplateSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Email Templates</h2>
      <p className="text-gray-600 text-sm">
        Customize the email notifications sent to customers.
      </p>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Order Confirmation</h3>
              <p className="text-sm text-gray-600">
                Sent to customers when they place an order
              </p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit Template
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Shipping Confirmation</h3>
              <p className="text-sm text-gray-600">
                Sent to customers when their order ships
              </p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit Template
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Order Delivered</h3>
              <p className="text-sm text-gray-600">
                Sent to customers when their order is delivered
              </p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit Template
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Password Reset</h3>
              <p className="text-sm text-gray-600">
                Sent to customers when they request a password reset
              </p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit Template
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Welcome Email</h3>
              <p className="text-sm text-gray-600">
                Sent to customers when they create an account
              </p>
            </div>
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Edit Template
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Email Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              defaultValue="2MMC"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender Email
            </label>
            <input
              type="email"
              defaultValue="noreply@benzo.nl"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagementSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">User Management</h2>
      <p className="text-gray-600 text-sm">
        Manage admin users and their permissions.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Admin User
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                admin@example.com
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Administrator
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Today, 10:30 AM
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-teal-600 hover:text-teal-900 mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                John Doe
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                john@example.com
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Manager
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Yesterday, 3:45 PM
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-teal-600 hover:text-teal-900 mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Jane Smith
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                jane@example.com
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Staff
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                2 days ago
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-teal-600 hover:text-teal-900 mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
        Add New User
      </button>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">User Roles</h3>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Administrator</h4>
                <p className="text-sm text-gray-600">
                  Full access to all settings and features
                </p>
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Edit Permissions
              </button>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Manager</h4>
                <p className="text-sm text-gray-600">
                  Can manage products, orders, and customers
                </p>
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Edit Permissions
              </button>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Staff</h4>
                <p className="text-sm text-gray-600">
                  Can view and process orders
                </p>
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Edit Permissions
              </button>
            </div>
          </div>
        </div>
        <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 flex items-center">
          + Add New Role
        </button>
      </div>
    </div>
  );
}

function TaxSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Tax Settings</h2>
      <p className="text-gray-600 text-sm">
        Configure tax rates and settings for your store.
      </p>

      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="prices_include_tax"
          defaultChecked
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
        <label
          htmlFor="prices_include_tax"
          className="ml-2 block text-sm text-gray-900"
        >
          Prices include tax
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium mb-2">Tax Rates</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  State/Province
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rate (%)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Netherlands
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  All
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  21
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Standaard
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-teal-600 hover:text-teal-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Netherlands
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  All
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Laag
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-teal-600 hover:text-teal-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Belgium
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  All
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  21
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Standaard
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-teal-600 hover:text-teal-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 flex items-center">
          + Add Tax Rate
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Tax Classes</h3>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Standard Rate</h4>
                <p className="text-sm text-gray-600">
                  Default tax class for most products
                </p>
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Edit
              </button>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reduced Rate</h4>
                <p className="text-sm text-gray-600">
                  For products with reduced tax rate
                </p>
              </div>
              <button className="text-sm text-teal-600 hover:text-teal-700">
                Edit
              </button>
            </div>
          </div>
        </div>
        <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 flex items-center">
          + Add Tax Class
        </button>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">General Settings</h2>
      <p className="text-gray-600 text-sm">
        Configure general store settings and preferences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Language
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="nl">Dutch</option>
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="Europe/Amsterdam">Europe/Amsterdam (UTC+1)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="dd-mm-yyyy">DD-MM-YYYY</option>
            <option value="mm-dd-yyyy">MM-DD-YYYY</option>
            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Products Per Page
          </label>
          <input
            type="number"
            defaultValue="12"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Maintenance Mode</h3>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="maintenance_mode"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="maintenance_mode"
            className="ml-2 block text-sm text-gray-900"
          >
            Enable maintenance mode
          </label>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                When maintenance mode is enabled, the store will be inaccessible
                to customers. Only administrators will be able to access the
                site.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Message
          </label>
          <textarea
            rows={3}
            defaultValue="Our store is currently undergoing maintenance. Please check back soon."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Cookie Consent</h3>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="cookie_consent"
            defaultChecked
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label
            htmlFor="cookie_consent"
            className="ml-2 block text-sm text-gray-900"
          >
            Enable cookie consent banner
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cookie Consent Message
          </label>
          <textarea
            rows={3}
            defaultValue="This website uses cookies to ensure you get the best experience on our website."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
