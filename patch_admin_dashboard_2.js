const fs = require('fs');
let content = fs.readFileSync('c:/Users/ssaip/html and css/Client projects/Twilight studios/frontend/src/pages/AdminDashboard.jsx', 'utf8');

content = content.replace(/useState\('cms'\);/, "useState('dashboard');");
content = content.replace(/\{\['cms',/g, "{['dashboard', 'cms',");

const dashboardContent = `
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-oswald uppercase tracking-widest text-white">Performance Overview</h2>
                  <p className="text-gray-400 font-sans font-light text-sm mt-1">Track your inquiries and conversion metrics.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={glassPanel + " p-6 flex flex-col"}>
                  <div className="text-gray-500 font-sans text-[10px] uppercase tracking-widest mb-2">Total Leads</div>
                  <div className="text-5xl font-oswald text-white mb-4">{leads.length}</div>
                  <div className="text-emerald-500 font-sans text-[10px] tracking-widest">Landing page inquiries</div>
                </div>
                <div className={glassPanel + " p-6 flex flex-col"}>
                  <div className="text-gray-500 font-sans text-[10px] uppercase tracking-widest mb-2">Total Inquiries</div>
                  <div className="text-5xl font-oswald text-white mb-4">{inquiries.length}</div>
                  <div className="text-emerald-500 font-sans text-[10px] tracking-widest">General inquiries</div>
                </div>
                <div className={glassPanel + " p-6 flex flex-col"}>
                  <div className="text-gray-500 font-sans text-[10px] uppercase tracking-widest mb-2">Pending</div>
                  <div className="text-5xl font-oswald text-white mb-4">
                    {leads.filter(l => l.status === 'PENDING' || l.status === 'Pending').length + inquiries.filter(i => i.status === 'PENDING' || i.status === 'Pending').length}
                  </div>
                  <div className="text-emerald-500 font-sans text-[10px] tracking-widest">Needs review (Combined)</div>
                </div>
                <div className={glassPanel + " p-6 flex flex-col"}>
                  <div className="text-gray-500 font-sans text-[10px] uppercase tracking-widest mb-2">Confirmed</div>
                  <div className="text-5xl font-oswald text-white mb-4">
                    {leads.filter(l => l.status === 'CONFIRMED' || l.status === 'CONTACTED' || l.status === 'Confirmed' || l.status === 'Contacted').length + inquiries.filter(i => i.status === 'CONFIRMED' || i.status === 'Confirmed').length}
                  </div>
                  <div className="text-emerald-500 font-sans text-[10px] tracking-widest">Converted (Combined)</div>
                </div>
              </div>

              <div className={glassPanel + " p-8 mt-8"}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-oswald uppercase tracking-widest text-white">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab('inquiries')} className="text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors rounded text-white">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 text-[10px] uppercase tracking-widest">
                        <th className="py-4 font-normal">Type</th>
                        <th className="py-4 font-normal">Client Name</th>
                        <th className="py-4 font-normal">Event Date</th>
                        <th className="py-4 font-normal">Details</th>
                        <th className="py-4 font-normal">Status</th>
                        <th className="py-4 font-normal">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...leads.map(l => ({...l, isLead: true, created: l.createdAt || l.date})), ...inquiries.map(i => ({...i, isLead: false, created: i.createdAt || i.date}))]
                        .sort((a, b) => new Date(b.created) - new Date(a.created))
                        .slice(0, 5)
                        .map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4"><span className="text-[9px] uppercase tracking-widest border border-purple-500/30 text-purple-400 px-2 py-1 rounded">{item.isLead ? 'LEAD' : 'INQUIRY'}</span></td>
                          <td className="py-4 text-white">{item.name}</td>
                          <td className="py-4 text-gray-400">{item.eventDate || item.date || 'N/A'}</td>
                          <td className="py-4 text-gray-400">{item.interestedIn || item.service || 'N/A'}</td>
                          <td className="py-4"><span className="text-[9px] uppercase tracking-widest border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded">{item.status}</span></td>
                          <td className="py-4"><button onClick={() => setActiveTab(item.isLead ? 'leads' : 'inquiries')} className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Review</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
`;

content = content.replace("{activeTab === 'cms' && (", dashboardContent + "\n          {activeTab === 'cms' && (");

const threeSixtyUploader = `
                      <div className="mt-6 bg-black/40 p-4 border border-white/5">
                        <h4 className="font-oswald uppercase tracking-widest text-sm text-white mb-4">360 Viewer Images</h4>
                        <DragDropImageUploader onUpload={(urls) => setEditingLandingPage({...editingLandingPage, threeSixtyImages: [...(editingLandingPage.threeSixtyImages || []), ...(Array.isArray(urls)?urls:[urls])]})} />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {(editingLandingPage.threeSixtyImages || []).map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} className="w-full aspect-video object-cover border border-white/20" alt="360" />
                              <button type="button" onClick={() => setEditingLandingPage({...editingLandingPage, threeSixtyImages: editingLandingPage.threeSixtyImages.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 bg-red-500/80 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
`;

content = content.replace(/<h4 className="font-oswald uppercase tracking-widest text-sm text-white mb-4">Portfolio Videos<\/h4>/, threeSixtyUploader + '\n                      <h4 className="font-oswald uppercase tracking-widest text-sm text-white mb-4">Portfolio Videos</h4>');

fs.writeFileSync('c:/Users/ssaip/html and css/Client projects/Twilight studios/frontend/src/pages/AdminDashboard.jsx', content);
console.log('AdminDashboard patched successfully!');
