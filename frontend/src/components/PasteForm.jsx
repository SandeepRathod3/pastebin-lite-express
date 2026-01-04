import { useState } from 'react';
import { Clock, Eye, Send } from 'lucide-react';
import { pasteAPI } from '../services/api';

export const PasteForm = ({ onPasteCreated }) => {
  const [form, setForm] = useState({
    content: '',
    ttlSeconds: '',
    maxViews: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        content: form.content,
        ...(form.ttlSeconds && { ttl_seconds: parseInt(form.ttlSeconds) }),
        ...(form.maxViews && { max_views: parseInt(form.maxViews) }),
      };

      const result = await pasteAPI.create(data);
      onPasteCreated?.(result);
      
      // Reset form
      setForm({ content: '', ttlSeconds: '', maxViews: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Paste your text here..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ttlSeconds" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Expiry (seconds)
          </label>
          <input
            type="number"
            id="ttlSeconds"
            name="ttlSeconds"
            value={form.ttlSeconds}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 3600 (1 hour)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="maxViews" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Eye className="w-4 h-4" />
            Max Views
          </label>
          <input
            type="number"
            id="maxViews"
            name="maxViews"
            value={form.maxViews}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !form.content.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        <Send className="w-5 h-5" />
        {loading ? 'Creating...' : 'Create Paste'}
      </button>
    </form>
  );
};