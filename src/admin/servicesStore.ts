import { FormSchema, Service, ServiceType } from '../../types';
import { SERVICES_KEY } from './storageKeys';

const DEFAULT_SERVICE_TYPE: ServiceType = 'CALL_1_1';

const slugify = (value: string): string => {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

const ensureUniqueSlug = (desired: string, services: Service[], ignoreId?: string): string => {
  const base = slugify(desired) || 'service';
  const taken = new Set(
    services
      .filter(s => (ignoreId ? s.id !== ignoreId : true))
      .map(s => s.slug)
  );

  if (!taken.has(base)) return base;

  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
};

const defaultFormSchemaForType = (serviceType: ServiceType): FormSchema => {
  // Keep these minimal for now. You can expand later without breaking stored data.
  if (serviceType === 'DIGITAL_PRODUCT' || serviceType === 'PACKAGE') {
    return {
      version: 1,
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'phone', label: 'Phone number', type: 'phone', required: false },
      ],
    };
  }

  if (serviceType === 'WRITTEN_ANALYSIS') {
    return {
      version: 1,
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'question', label: 'Your question', type: 'textarea', required: true },
        { key: 'dob', label: 'Date of Birth (dd/mm/yyyy)', type: 'date', required: true },
        { key: 'pob', label: 'Place of Birth (city, state)', type: 'text', required: true },
        { key: 'tob', label: 'Time of Birth', type: 'time', required: false },
      ],
    };
  }

  if (serviceType === 'REPORT') {
    return {
      version: 1,
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'dob', label: 'Date of Birth (dd/mm/yyyy)', type: 'date', required: true },
        { key: 'pob', label: 'Place of Birth (city, state)', type: 'text', required: true },
        { key: 'tob', label: 'Time of Birth', type: 'time', required: false },
        { key: 'notes', label: 'Context / Notes', type: 'textarea', required: false },
      ],
    };
  }

  // CALL_1_1
  return {
    version: 1,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', type: 'phone', required: false },
      { key: 'dob', label: 'Date of Birth (dd/mm/yyyy)', type: 'date', required: true },
      { key: 'pob', label: 'Place of Birth (city, state)', type: 'text', required: true },
      { key: 'tob', label: 'Time of Birth', type: 'time', required: false },
      { key: 'agenda', label: 'Context / what you want to discuss', type: 'textarea', required: false },
    ],
  };
};

const normalizeServices = (raw: unknown): Service[] => {
  if (!Array.isArray(raw)) return [];
  const list: Service[] = [];

  for (let i = 0; i < raw.length; i += 1) {
    const r: any = raw[i] || {};
    const serviceType: ServiceType = r.serviceType || DEFAULT_SERVICE_TYPE;
    const title = typeof r.title === 'string' ? r.title : 'Untitled Service';
    const id = typeof r.id === 'string' && r.id ? r.id : `srv-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const createdAt = typeof r.createdAt === 'string' && r.createdAt ? r.createdAt : new Date().toISOString();
    const updatedAt = typeof r.updatedAt === 'string' && r.updatedAt ? r.updatedAt : createdAt;
    const desiredSlug = typeof r.slug === 'string' && r.slug ? r.slug : slugify(title);
    const slug = ensureUniqueSlug(desiredSlug, list);

    const formSchema: FormSchema =
      r.formSchema && typeof r.formSchema === 'object' && Array.isArray(r.formSchema.fields)
        ? {
            version: typeof r.formSchema.version === 'number' ? r.formSchema.version : 1,
            fields: r.formSchema.fields,
          }
        : defaultFormSchemaForType(serviceType);

    list.push({
      id,
      serviceType,
      slug,
      title,
      description: typeof r.description === 'string' ? r.description : '',
      durationMins: typeof r.durationMins === 'number' ? r.durationMins : 60,
      priceInr: typeof r.priceInr === 'number' ? r.priceInr : 0,
      isActive: typeof r.isActive === 'boolean' ? r.isActive : true,
      formSchema,
      createdAt,
      updatedAt,
      metadata: r.metadata && typeof r.metadata === 'object' ? r.metadata : {},
    });
  }

  return list;
};

const getStorage = (): Service[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(SERVICES_KEY);
    const raw = item ? JSON.parse(item) : [];
    const normalized = normalizeServices(raw);
    // Auto-heal storage when older versions are missing new fields.
    if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
      setStorage(normalized);
    }
    return normalized;
  } catch (e) {
    console.error('Failed to parse services', e);
    return [];
  }
};

const setStorage = (data: Service[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(data));
  }
};

export const listServices = (): Service[] => {
  return getStorage().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const listActiveServices = (opts?: { serviceType?: ServiceType }): Service[] => {
  const active = listServices().filter(s => s.isActive);
  return opts?.serviceType ? active.filter(s => s.serviceType === opts.serviceType) : active;
};

export const getService = (id: string): Service | null => {
  const services = getStorage();
  return services.find(s => s.id === id) || null;
};

export const upsertService = (serviceInput: Partial<Service>): Service => {
  const services = getStorage();
  const now = new Date().toISOString();

  if (serviceInput.id) {
    // Update
    const idx = services.findIndex(s => s.id === serviceInput.id);
    if (idx !== -1) {
      const existing = services[idx];
      const nextType: ServiceType = serviceInput.serviceType || existing.serviceType || DEFAULT_SERVICE_TYPE;
      const nextTitle = serviceInput.title ?? existing.title;

      const desiredSlug = (serviceInput.slug ?? existing.slug) || slugify(nextTitle);
      const slug = ensureUniqueSlug(desiredSlug, services, existing.id);

      const updated: Service = {
        ...existing,
        ...serviceInput,
        serviceType: nextType,
        title: nextTitle,
        slug,
        formSchema: serviceInput.formSchema || existing.formSchema || defaultFormSchemaForType(nextType),
        updatedAt: now,
        metadata: serviceInput.metadata || existing.metadata || {},
      };
      services[idx] = updated;
      setStorage(services);
      return updated;
    }
  }

  // Create
  const serviceType: ServiceType = serviceInput.serviceType || DEFAULT_SERVICE_TYPE;
  const title = serviceInput.title || 'Untitled Service';
  const desiredSlug = serviceInput.slug || slugify(title);
  const slug = ensureUniqueSlug(desiredSlug, services);

  const newService: Service = {
    id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    serviceType,
    slug,
    title,
    durationMins: serviceInput.durationMins ?? (serviceType === 'DIGITAL_PRODUCT' || serviceType === 'PACKAGE' ? 0 : 60),
    priceInr: serviceInput.priceInr ?? 0,
    description: serviceInput.description || '',
    isActive: serviceInput.isActive ?? true,
    formSchema: serviceInput.formSchema || defaultFormSchemaForType(serviceType),
    createdAt: now,
    updatedAt: now,
    metadata: serviceInput.metadata || {},
  };

  services.unshift(newService); // Add to top
  setStorage(services);
  return newService;
};

export const deleteService = (id: string): void => {
  const services = getStorage();
  const filtered = services.filter(s => s.id !== id);
  setStorage(filtered);
};

export const toggleServiceActive = (id: string): void => {
  const services = getStorage();
  const service = services.find(s => s.id === id);
  if (service) {
    service.isActive = !service.isActive;
    service.updatedAt = new Date().toISOString();
    setStorage(services);
  }
};

export const seedDefaultServicesIfEmpty = (): void => {
  const services = getStorage();
  if (services.length > 0) return;

  const defaults: Partial<Service>[] = [
    {
      serviceType: 'CALL_1_1',
      title: 'Natal Chart Deep Dive',
      slug: 'natal-chart-deep-dive',
      durationMins: 60,
      priceInr: 2500,
      description: 'Comprehensive analysis of D1, D9, and D10 charts. We cover your core personality, career trajectory, and current Dasha timing.',
      isActive: true,
    },
    {
      serviceType: 'CALL_1_1',
      title: 'Specific Question (Prashna)',
      slug: 'specific-question-prashna',
      durationMins: 30,
      priceInr: 1200,
      description: 'Laser-focused reading for a single burning question. Uses Tajik Neelakanthi and KP methods for precision.',
      isActive: true,
    },
    {
      serviceType: 'REPORT',
      title: 'Relationship Compatibility',
      slug: 'relationship-compatibility-report',
      durationMins: 45,
      priceInr: 1800,
      description: 'Detailed synastry matching. We go beyond Gun Milan to check psychological compatibility and Karmic ties.',
      isActive: true,
    }
  ];

  defaults.forEach(d => upsertService(d));
};
