import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Layout, FileText, Users, Video, CheckCircle, Award, BookOpen } from 'lucide-react';
import { LIVE_COURSES, RECORDED_COURSES, RECORDED_WEBINARS } from '../constants';

const CourseDeliverableBadge = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold text-gray-600">
    <Icon size={10} />
    <span>{label}</span>
  </div>
);

const Courses: React.FC = () => {
  return (
    <div className="animate-fade-in bg-[#F9F9F7] pb-20">
      {/* Header */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Award className="h-4 w-4 mr-2" />
            Astrokarak Academy
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Structured Learning</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            From foundational mechanics to advanced predictive techniques. Join a cohort or learn at your own pace.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        
        {/* Live Cohorts */}
        <div className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Live Cohorts</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Interactive Mentorship</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LIVE_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                   <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   {course.isUpcoming && (
                     <div className="absolute top-4 right-4 bg-amber-700 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                       Enrollment Open
                     </div>
                   )}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">{course.title}</h3>
                    <span className="text-lg font-bold text-amber-700">{course.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{course.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>12 Weeks of Live Classes (Zoom)</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Private Community Access</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Certificate of Completion</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                    Apply for Cohort
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recorded Courses */}
        <div className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Recorded Masterclasses</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Self-Paced Learning</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RECORDED_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:border-amber-200 transition-all">
                <div className="w-full sm:w-48 bg-gray-50 border-r border-gray-100 shrink-0 h-48 sm:h-auto relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight">{course.title}</h3>
                    <span className="text-sm font-bold text-amber-700">{course.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">{course.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <CourseDeliverableBadge icon={Video} label="HD Video" />
                      <CourseDeliverableBadge icon={Layout} label="Slides" />
                      <CourseDeliverableBadge icon={FileText} label="PDF Notes" />
                    </div>
                    <button className="w-full py-3 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all shadow-sm">
                      Get Instant Access
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webinars */}
        <div>
           <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Deep-Dive Webinars</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">2-3 Hour Special Topics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECORDED_WEBINARS.map(webinar => (
              <div key={webinar.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{webinar.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{webinar.description}</p>
                <div className="flex items-center justify-between mt-auto">
                   <span className="font-bold text-amber-700">{webinar.price}</span>
                   <button className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-0.5 hover:text-amber-700 hover:border-amber-700 transition-colors">
                     Watch Now
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Courses;