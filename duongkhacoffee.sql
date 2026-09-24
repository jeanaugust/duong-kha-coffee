--
-- PostgreSQL database dump
--

\restrict HFhZ7A4ba1LYbhV7nyOyYlwWjSEeh5sDKNj1vQOxfVRkUvfkvo9vR85Qank27Jv

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-25 04:41:30

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16405)
-- Name: customer_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_contacts (
    id integer NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 221 (class 1259 OID 16404)
-- Name: customer_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_contacts_id_seq OWNED BY public.customer_contacts.id;


--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    price numeric(12,2) DEFAULT 0.00 NOT NULL,
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    taste text,
    brewing_method text,
    shelf_life character varying(100) DEFAULT '6 tháng kể từ ngày sản xuất'::character varying,
    grind_type character varying(100) DEFAULT 'Xay sẵn (Bột) / Nguyên hạt'::character varying
);


--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 4866 (class 2604 OID 16408)
-- Name: customer_contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_contacts ALTER COLUMN id SET DEFAULT nextval('public.customer_contacts_id_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16394)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 5022 (class 0 OID 16405)
-- Dependencies: 222
-- Data for Name: customer_contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_contacts (id, fullname, email, phone, message, created_at) FROM stdin;
1	Mike Tran	mikelandviettat@gmail.com	0932631785	hãy liên hệ với tôi lúc 3h chiều	2026-09-23 01:53:03.210144
\.


--
-- TOC entry 5020 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, image_url, created_at, taste, brewing_method, shelf_life, grind_type) FROM stdin;
1	Cà Phê Robusta Gia Truyền	Hương vị truyền thống đậm đà khó quên, đánh thức năng lượng cho ngày mới.	220000.00	/images/robusta.png	2026-09-17 15:15:48.504692	Đắng đậm, thơm nồng, hậu vị ngọt nhẹ, ít chua	Pha Phin truyền thống (Cà phê đen đá, cà phê sữa đá)	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
2	Cà Phê Mộc Robusta	100% hạt Robusta chọn lọc rang mộc nguyên chất, giữ trọn gu cà phê nguyên bản.	230000.00	/images/moc-robusta.png	2026-09-17 15:15:48.504692	Đắng êm, thơm tự nhiên, hậu vị ngọt kéo dài	Pha Phin đậm đà hoặc Pha Máy (Espresso)	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
3	Cà Phê Mộc Arabica	Hạt Arabica cao nguyên rang mộc, hương hoa cỏ thanh nhã và cân bằng.	290000.00	/images/moc-arabica.png	2026-09-17 15:15:48.504692	Chua thanh nhẹ, thơm quyến rũ, đắng dịu	Pha Máy (Espresso, Latte, Cappuccino) hoặc Pour Over	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
4	Cà Phê Cherry (Exelsa)	Dòng cà phê hiếm có với hương thơm trái cây chín quyến rũ.	380000.00	/images/cherry.png	2026-09-17 15:15:48.504692	Chua dịu trái cây, mùi thơm độc đáo, hậu vị sảng khoái	Pha Phin sáng tạo, Cold Brew (Ủ lạnh)	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
5	Cà Phê Honey Bi	Chế biến theo phương pháp Mật Ong (Honey Process) cao cấp, lên men tự nhiên.	400000.00	/images/honey.png	2026-09-17 15:15:48.504692	Ngọt hậu đậm đà, hương thơm mật ong chín, đắng dịu	Pha Phin cao cấp, Pour Over, Syphon hoặc Cold Brew	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
6	Cà Phê Moka Thượng Hạng	Nữ hoàng cà phê với hương thơm sang trọng bậc nhất và vị chua thanh quý phái.	460000.00	/images/moka.png	2026-09-17 15:15:48.504692	Chua thanh tinh tế, đắng nhẹ, hương thơm nồng nàn quý tộc	Pha Phin thưởng thức mộc, French Press, Pour Over hoặc Espresso	6 tháng kể từ ngày sản xuất	Xay sẵn (Bột) / Nguyên hạt
\.


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_contacts_id_seq', 1, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- TOC entry 4871 (class 2606 OID 16416)
-- Name: customer_contacts customer_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_contacts
    ADD CONSTRAINT customer_contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16403)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


-- Completed on 2026-09-25 04:41:31

--
-- PostgreSQL database dump complete
--

\unrestrict HFhZ7A4ba1LYbhV7nyOyYlwWjSEeh5sDKNj1vQOxfVRkUvfkvo9vR85Qank27Jv

