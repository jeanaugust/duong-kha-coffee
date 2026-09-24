--
-- PostgreSQL database dump
--

\restrict 6GQWognMC90dGFmNveDMkiJ3YDYwOs5rS7PgN36DIhjTcOhs6ieI6Heb4cRg939

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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

ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_contacts DROP CONSTRAINT IF EXISTS customer_contacts_pkey;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_contacts ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.customer_contacts_id_seq;
DROP TABLE IF EXISTS public.customer_contacts;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
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
-- Name: customer_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_contacts_id_seq OWNED BY public.customer_contacts.id;


--
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
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: customer_contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_contacts ALTER COLUMN id SET DEFAULT nextval('public.customer_contacts_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: customer_contacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customer_contacts VALUES (1, 'Mike Tran', 'mikelandviettat@gmail.com', '0932631785', 'hãy liên hệ với tôi lúc 3h chiều', '2026-09-23 01:53:03.210144');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (1, 'Cà Phê Robusta Gia Truyền', 'Hương vị truyền thống đậm đà khó quên, đánh thức năng lượng cho ngày mới.', 220000.00, '/images/robusta.png', '2026-09-17 15:15:48.504692', 'Đắng đậm, thơm nồng, hậu vị ngọt nhẹ, ít chua', 'Pha Phin truyền thống (Cà phê đen đá, cà phê sữa đá)', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');
INSERT INTO public.products VALUES (2, 'Cà Phê Mộc Robusta', '100% hạt Robusta chọn lọc rang mộc nguyên chất, giữ trọn gu cà phê nguyên bản.', 230000.00, '/images/moc-robusta.png', '2026-09-17 15:15:48.504692', 'Đắng êm, thơm tự nhiên, hậu vị ngọt kéo dài', 'Pha Phin đậm đà hoặc Pha Máy (Espresso)', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');
INSERT INTO public.products VALUES (3, 'Cà Phê Mộc Arabica', 'Hạt Arabica cao nguyên rang mộc, hương hoa cỏ thanh nhã và cân bằng.', 290000.00, '/images/moc-arabica.png', '2026-09-17 15:15:48.504692', 'Chua thanh nhẹ, thơm quyến rũ, đắng dịu', 'Pha Máy (Espresso, Latte, Cappuccino) hoặc Pour Over', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');
INSERT INTO public.products VALUES (4, 'Cà Phê Cherry (Exelsa)', 'Dòng cà phê hiếm có với hương thơm trái cây chín quyến rũ.', 380000.00, '/images/cherry.png', '2026-09-17 15:15:48.504692', 'Chua dịu trái cây, mùi thơm độc đáo, hậu vị sảng khoái', 'Pha Phin sáng tạo, Cold Brew (Ủ lạnh)', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');
INSERT INTO public.products VALUES (5, 'Cà Phê Honey Bi', 'Chế biến theo phương pháp Mật Ong (Honey Process) cao cấp, lên men tự nhiên.', 400000.00, '/images/honey.png', '2026-09-17 15:15:48.504692', 'Ngọt hậu đậm đà, hương thơm mật ong chín, đắng dịu', 'Pha Phin cao cấp, Pour Over, Syphon hoặc Cold Brew', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');
INSERT INTO public.products VALUES (6, 'Cà Phê Moka Thượng Hạng', 'Nữ hoàng cà phê với hương thơm sang trọng bậc nhất và vị chua thanh quý phái.', 460000.00, '/images/moka.png', '2026-09-17 15:15:48.504692', 'Chua thanh tinh tế, đắng nhẹ, hương thơm nồng nàn quý tộc', 'Pha Phin thưởng thức mộc, French Press, Pour Over hoặc Espresso', '6 tháng kể từ ngày sản xuất', 'Xay sẵn (Bột) / Nguyên hạt');


--
-- Name: customer_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_contacts_id_seq', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- Name: customer_contacts customer_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_contacts
    ADD CONSTRAINT customer_contacts_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 6GQWognMC90dGFmNveDMkiJ3YDYwOs5rS7PgN36DIhjTcOhs6ieI6Heb4cRg939

