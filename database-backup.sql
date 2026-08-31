--
-- PostgreSQL database dump
--

\restrict IhqCuEzLBzG7GGIaRhauMTQ8DyvgbfzoW9SSzNZTJafzboIbaimqG7P0rce5REm

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: clinics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinics (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    nit character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.clinics OWNER TO postgres;

--
-- Name: inventories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventories (
    id uuid NOT NULL,
    "warehouseId" uuid NOT NULL,
    "medicineId" uuid NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT check_quantity_non_negative CHECK ((quantity >= 0))
);


ALTER TABLE public.inventories OWNER TO postgres;

--
-- Name: medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicines (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    unit character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.medicines OWNER TO postgres;

--
-- Name: supply_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supply_requests (
    id uuid NOT NULL,
    "clinicId" uuid NOT NULL,
    "medicineId" uuid NOT NULL,
    "warehouseId" uuid,
    quantity integer NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    "requestedBy" uuid,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT check_quantity_positive CHECK ((quantity > 0))
);


ALTER TABLE public.supply_requests OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying DEFAULT 'GESTOR_SOLICITUDES'::character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250830000000-create-users.js
20250831000001-add-isActive-and-update-roles.js
20250831000002-create-clinics.js
20250831000003-create-warehouses.js
20250831000004-create-medicines.js
20250831000005-create-inventories.js
20250831000006-create-supply-requests.js
\.


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinics (id, name, nit, address, phone, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventories (id, "warehouseId", "medicineId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicines (id, name, description, unit, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: supply_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supply_requests (id, "clinicId", "medicineId", "warehouseId", quantity, status, "requestedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, "createdAt", "updatedAt", "isActive") FROM stdin;
6f620ecb-f380-4afd-89a9-7b9dd1c571b0	Test Admin	admin.test11@example.com	$2b$10$PqAno3r1UYN8FY67LhcqfOcSBC/bnRXycHha6LXA5rS6A7TtWwGfO	ADMIN	2026-08-31 15:40:09.632+00	2026-08-31 15:40:09.632+00	t
9916c605-a1fe-4fd1-aa21-6c077711dbd7	Carlos	carlos@test.com	$2b$10$UTO9N2dYrqrTDx9vO9oQnuYA/QDIlVRD2oBWMVJu5tyG0WMgjDIC6	GESTOR_SOLICITUDES	2026-08-31 16:24:39.273+00	2026-08-31 16:24:39.273+00	t
32a5f633-e149-49df-a330-9ba9e85db091	Carlos	carlos@tes.com	$2b$10$NdkrjfFRURBk34lMtGZ6N.BxuK9ap9o4WHOopVJjBhNxOq5D/hJIG	ADMIN	2026-08-31 16:40:40.362+00	2026-08-31 16:40:40.362+00	t
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, name, location, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: clinics clinics_nit_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_nit_key UNIQUE (nit);


--
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- Name: inventories inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);


--
-- Name: medicines medicines_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_name_key UNIQUE (name);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- Name: supply_requests supply_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT supply_requests_pkey PRIMARY KEY (id);


--
-- Name: inventories unique_warehouse_medicine; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT unique_warehouse_medicine UNIQUE ("warehouseId", "medicineId");


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: inventories inventories_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT "inventories_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public.medicines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventories inventories_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT "inventories_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: supply_requests supply_requests_clinicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES public.clinics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: supply_requests supply_requests_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public.medicines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: supply_requests supply_requests_requestedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: supply_requests supply_requests_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supply_requests
    ADD CONSTRAINT "supply_requests_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict IhqCuEzLBzG7GGIaRhauMTQ8DyvgbfzoW9SSzNZTJafzboIbaimqG7P0rce5REm

