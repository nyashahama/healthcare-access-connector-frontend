import React, { useState } from "react";
import {
  FaSyringe,
  FaBaby,
  FaHeartbeat,
  FaFlask,
  FaStethoscope,
  FaUserMd,
  FaChartBar,
  FaPlus,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import {
  MdAdd,
  MdCheckCircle,
  MdEdit,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ServicesOffered = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Immunizations",
      icon: <FaSyringe />,
      category: "Preventive",
      active: true,
      popularity: 95,
      description: "Routine and travel vaccinations for all age groups",
      duration: "30 minutes",
      price: "Free - R500",
      requirements: "Medical aid card, ID book",
    },
    {
      id: 2,
      name: "Child Health",
      icon: <FaBaby />,
      category: "Pediatric",
      active: true,
      popularity: 88,
      description:
        "Growth monitoring, developmental assessments, and pediatric care",
      duration: "45 minutes",
      price: "R300 - R800",
      requirements: "Child's clinic card, immunization record",
    },
    {
      id: 3,
      name: "Chronic Disease",
      icon: <FaHeartbeat />,
      category: "Adult",
      active: true,
      popularity: 76,
      description:
        "Management of diabetes, hypertension, and other chronic conditions",
      duration: "60 minutes",
      price: "R400 - R1,000",
      requirements: "Medical history, current medications",
    },
    {
      id: 4,
      name: "HIV Testing",
      icon: <FaFlask />,
      category: "Testing",
      active: true,
      popularity: 82,
      description: "Confidential HIV testing and counseling services",
      duration: "45 minutes",
      price: "Free",
      requirements: "ID book, consent form",
    },
    {
      id: 5,
      name: "TB Screening",
      icon: <FaStethoscope />,
      category: "Testing",
      active: true,
      popularity: 69,
      description: "Tuberculosis screening and referral services",
      duration: "30 minutes",
      price: "Free",
      requirements: "Symptoms assessment, contact history",
    },
    {
      id: 6,
      name: "Prenatal Care",
      icon: <FaUserMd />,
      category: "Women's Health",
      active: false,
      popularity: 0,
      description: "Pregnancy care, antenatal checks, and delivery planning",
      duration: "60 minutes",
      price: "R600 - R1,200",
      requirements: "Pregnancy confirmation, medical history",
    },
    {
      id: 7,
      name: "Nutrition Counseling",
      icon: "🥗",
      category: "Wellness",
      active: true,
      popularity: 54,
      description: "Dietary planning and nutritional guidance",
      duration: "60 minutes",
      price: "R400 - R800",
      requirements: "Food diary, health goals",
    },
    {
      id: 8,
      name: "Mental Health",
      icon: "🧠",
      category: "Wellness",
      active: false,
      popularity: 0,
      description: "Counseling and mental health support services",
      duration: "60 minutes",
      price: "R500 - R1,000",
      requirements: "Referral letter, medical history",
    },
  ]);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Preventive",
    active: true,
    description: "",
    duration: "",
    price: "",
    requirements: "",
  });

  const { showToast } = useToast();

  const toggleService = (id) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
    showToast(
      services.find((s) => s.id === id).active
        ? "Service deactivated"
        : "Service activated",
      "success"
    );
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      active: service.active,
      description: service.description,
      duration: service.duration,
      price: service.price,
      requirements: service.requirements,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setServiceForm({
      name: "",
      category: "Preventive",
      active: true,
      description: "",
      duration: "",
      price: "",
      requirements: "",
    });
    setAddModalOpen(true);
  };

  const confirmAdd = () => {
    console.log("Adding service:", serviceForm);
    setAddModalOpen(false);
    showToast("New service added successfully!", "success");
  };

  const confirmEdit = () => {
    console.log(`Editing service ${selectedService.id}`, serviceForm);
    setEditModalOpen(false);
    showToast("Service updated successfully!", "success");
  };

  const confirmDelete = () => {
    console.log(`Deleting service ${selectedService.id}`);
    setDeleteModalOpen(false);
    showToast("Service removed successfully!", "error");
  };

  const activeServices = services.filter((s) => s.active);
  const mostPopular = [...activeServices]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* View Service Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Service Details"
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  {selectedService.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {selectedService.name}
                  </h4>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {selectedService.category}
                  </span>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  selectedService.active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {selectedService.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Description
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedService.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-bold text-navy-700 dark:text-white">
                  {selectedService.duration}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-green-600">Price Range</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {selectedService.price}
                </p>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Requirements
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedService.requirements}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Service Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Service"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Name *
              </label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter service name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                value={serviceForm.category}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, category: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Preventive">Preventive</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Adult">Adult</option>
                <option value="Testing">Testing</option>
                <option value="Women's Health">Women's Health</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration *
              </label>
              <input
                type="text"
                value={serviceForm.duration}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, duration: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="E.g., 30 minutes"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range *
              </label>
              <input
                type="text"
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, price: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="E.g., Free - R500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
              placeholder="Describe the service..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Requirements
            </label>
            <textarea
              value={serviceForm.requirements}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, requirements: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="2"
              placeholder="List any requirements..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <FaPlus className="h-5 w-5" />
              Add Service
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Service"
        size="lg"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  value={serviceForm.category}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="Preventive">Preventive</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Adult">Adult</option>
                  <option value="Testing">Testing</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={serviceForm.active ? "active" : "inactive"}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      active: e.target.value === "active",
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Service"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Remove "{selectedService?.name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This service will be permanently removed from your offerings.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Remove Service
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaChartBar className="mr-3 text-brand-500" />
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Services Offered
            </h4>
            <p className="text-sm text-gray-600">
              {activeServices.length} active services
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
          >
            <MdAdd className="mr-2" />
            Add Service
          </button>
          <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-navy-600">
            <MdEdit />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`cursor-pointer rounded-xl border p-3 transition-all hover:scale-[1.03] ${
              service.active
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : "border-gray-200 bg-gray-50 dark:border-navy-600 dark:bg-navy-700/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg ${
                    service.active
                      ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-navy-600 dark:text-gray-400"
                  }`}
                >
                  {typeof service.icon === "string" ? (
                    <span className="text-lg">{service.icon}</span>
                  ) : (
                    React.cloneElement(service.icon, { className: "text-lg" })
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      service.active
                        ? "text-green-800 dark:text-green-300"
                        : "text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {service.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewService(service);
                  }}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="View Details"
                >
                  <FaEye className="h-4 w-4" />
                </button>
                <MdCheckCircle
                  className={`cursor-pointer text-lg ${
                    service.active
                      ? "text-green-500 hover:text-green-700"
                      : "text-gray-300 hover:text-gray-500 dark:text-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleService(service.id);
                  }}
                />
              </div>
            </div>

            {service.active && service.popularity > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Popularity
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {service.popularity}%
                  </span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${service.popularity}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Service Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-blue-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-blue-900/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {activeServices.length}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Active Services
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {Math.round(
              activeServices.reduce((acc, s) => acc + s.popularity, 0) /
                activeServices.length
            ) || 0}
            %
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Avg. Popularity
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            3
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Most Used
          </p>
        </div>
      </div>

      {/* Popular Services */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Most popular services this month:
        </p>
        <div className="space-y-2">
          {mostPopular.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition-all duration-300 hover:scale-[1.02] dark:bg-navy-700"
            >
              <div className="flex items-center">
                <span className="mr-3 font-bold text-brand-500">
                  {index + 1}
                </span>
                <span className="font-medium text-navy-700 dark:text-white">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  {service.popularity}% usage
                </span>
                <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${service.popularity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ServicesOffered;
