import React, { useState, useEffect } from "react";
import {
  FaSyringe,
  FaBaby,
  FaHeartbeat,
  FaFlask,
  FaStethoscope,
  FaUserMd,
  FaPlus,
  FaEye,
  FaTrash,
  FaFileMedical,
} from "react-icons/fa";
import { MdAdd, MdCheckCircle, MdEdit, MdWarning } from "react-icons/md";
import { useProvider } from "hooks/useProvider";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ServicesOffered = ({ clinicId }) => {
  const {
    getClinicService,
    registerService,
    updateService,
    deleteService,
    serviceList,
    loading,
  } = useProvider();
  const [services, setServices] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    service_name: "",
    service_category: "general",
    description: "",
    duration_minutes: 30,
    is_active: true,
  });

  const { showToast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      if (clinicId) {
        const result = await getClinicService(clinicId);
        if (result.success) {
          setServices(result.data);
        }
      }
    };

    fetchServices();
  }, [clinicId, getClinicService]);

  const getServiceIcon = (category) => {
    const icons = {
      vaccination: <FaSyringe />,
      pediatric: <FaBaby />,
      chronic_care: <FaHeartbeat />,
      testing: <FaFlask />,
      general: <FaStethoscope />,
      specialist: <FaUserMd />,
    };
    return icons[category] || <FaFileMedical />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      vaccination:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      pediatric:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      chronic_care: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      testing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      general:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      specialist:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  const handleAddService = () => {
    setServiceForm({
      service_name: "",
      service_category: "general",
      description: "",
      duration_minutes: 30,
      is_active: true,
    });
    setAddModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setServiceForm({
      service_name: service.service_name || "",
      service_category: service.service_category || "general",
      description: service.description || "",
      duration_minutes: service.duration_minutes || 30,
      is_active: service.is_active !== undefined ? service.is_active : true,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const handleSaveNewService = async () => {
    if (!clinicId) return;

    const result = await registerService({
      clinic_id: clinicId,
      ...serviceForm,
    });

    if (result.success) {
      setServices([...services, result.data]);
      setAddModalOpen(false);
      showToast("Service added successfully!", "success");
    } else {
      showToast("Failed to add service", "error");
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService?.service_id) return;

    const result = await updateService(selectedService.service_id, serviceForm);

    if (result.success) {
      setServices(
        services.map((s) =>
          s.service_id === selectedService.service_id ? result.data : s
        )
      );
      setEditModalOpen(false);
      showToast("Service updated successfully!", "success");
    } else {
      showToast("Failed to update service", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService?.service_id) return;

    const result = await deleteService(selectedService.service_id);

    if (result.success) {
      setServices(
        services.filter((s) => s.service_id !== selectedService.service_id)
      );
      setDeleteModalOpen(false);
      showToast("Service deleted successfully!", "success");
    } else {
      showToast("Failed to delete service", "error");
    }
  };

  const displayServices = services.length > 0 ? services : serviceList;

  if (loading && !displayServices.length) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-navy-700"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded bg-gray-200 dark:bg-navy-700"
            ></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* View Service Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Service Details"
        size="md"
      >
        {selectedService && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Service Name</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {selectedService.service_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                  selectedService.service_category
                )}`}
              >
                {selectedService.service_category}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {selectedService.description || "No description"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  {selectedService.duration_minutes} min
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    selectedService.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedService.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
        }}
        title={addModalOpen ? "Add New Service" : "Edit Service"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Service Name *
            </label>
            <input
              type="text"
              value={serviceForm.service_name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, service_name: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., General Consultation"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category *</label>
            <select
              value={serviceForm.service_category}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  service_category: e.target.value,
                })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="general">General</option>
              <option value="vaccination">Vaccination</option>
              <option value="pediatric">Pediatric</option>
              <option value="chronic_care">Chronic Care</option>
              <option value="testing">Testing</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={serviceForm.duration_minutes}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  duration_minutes: parseInt(e.target.value),
                })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              min="5"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={serviceForm.is_active}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded"
            />
            <label className="ml-2 text-sm">Active Service</label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setAddModalOpen(false);
                setEditModalOpen(false);
              }}
              className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={
                addModalOpen ? handleSaveNewService : handleUpdateService
              }
              disabled={loading}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : addModalOpen
                ? "Add Service"
                : "Update Service"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedService?.service_name}"?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border px-6 py-3 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Services Offered
        </h4>
        <button
          onClick={handleAddService}
          className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          <MdAdd className="mr-1" />
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {displayServices.length > 0 ? (
          displayServices.map((service) => (
            <div
              key={service.service_id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-navy-600"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${getCategoryColor(
                    service.service_category
                  )}`}
                >
                  {getServiceIcon(service.service_category)}
                </div>
                <div>
                  <h5 className="font-medium text-navy-700 dark:text-white">
                    {service.service_name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {service.service_category} •{" "}
                    {service.duration_minutes || 30} min
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    service.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </span>

                <button
                  onClick={() => handleViewService(service)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <FaEye className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleEditService(service)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <MdEdit className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDeleteClick(service)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <FaFileMedical className="mx-auto mb-4 text-5xl opacity-50" />
            <p>No services added yet</p>
            <button
              onClick={handleAddService}
              className="mt-4 text-brand-500 hover:text-brand-600"
            >
              Add your first service
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServicesOffered;
